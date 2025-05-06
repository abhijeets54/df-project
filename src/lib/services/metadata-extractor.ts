import { FileAnalysis, ImageMetadata, DocumentMetadata, AudioMetadata, VideoMetadata } from "../types";
import * as ExifReader from "exifreader";
import { fileTypeFromBlob } from "file-type";

// Define types for ExifReader tags
type ExifValue = string | number | Array<number> | { [key: string]: any };

interface ExifTag {
  id?: number;
  description?: string;
  value: ExifValue;
}

interface ExifTags {
  [key: string]: ExifTag;
}

interface ExifSection {
  [key: string]: ExifTag;
}

interface ExpandedExifTags {
  file?: ExifSection;
  exif?: ExifSection;
  gps?: ExifSection;
  [key: string]: ExifTag | ExifSection | undefined;
}

/**
 * Extract metadata from a file based on its type
 */
export const extractMetadata = async (file: File, analysis: FileAnalysis): Promise<FileAnalysis> => {
  try {
    // Determine the file type
    const fileTypeResult = await fileTypeFromBlob(file);
    
    // If file-type library detects a type, use it; otherwise fall back to the file's type
    const detectedType = fileTypeResult?.mime || file.type;
    
    // Extract metadata based on file type
    if (detectedType.startsWith("image/")) {
      analysis.metadata = await extractImageMetadata(file);
    } else if (
      detectedType === "application/pdf" ||
      detectedType.includes("document") ||
      detectedType.includes("spreadsheet") ||
      detectedType.includes("presentation")
    ) {
      analysis.metadata = await extractDocumentMetadata(file);
    } else if (detectedType.startsWith("audio/")) {
      analysis.metadata = await extractAudioMetadata(file);
    } else if (detectedType.startsWith("video/")) {
      analysis.metadata = await extractVideoMetadata(file);
    } else {
      // For unknown types, just use basic file info
      analysis.metadata = {}; 
    }
    
    return analysis;
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return analysis; // Return original analysis if extraction fails
  }
};

/**
 * Extract metadata from an image file
 */
const extractImageMetadata = async (file: File): Promise<ImageMetadata> => {
  try {
    // Read the file as an ArrayBuffer
    const buffer = await file.arrayBuffer();
    
    // Parse EXIF data using ExifReader
    const tags = ExifReader.load(buffer, { expanded: true }) as unknown as ExpandedExifTags;
    
    // Log the tags to help with debugging
    console.log('EXIF tags extracted:', tags);
    
    // Extract relevant image metadata
    const metadata: ImageMetadata = {};
    
    // Image dimensions - try to get numeric values
    // First check the expanded tags structure
    if (tags.file && 'Image Width' in tags.file) {
      metadata.width = Number(tags.file['Image Width'].value);
    } else if (tags.exif && 'PixelXDimension' in tags.exif) {
      metadata.width = Number(tags.exif.PixelXDimension.value);
    } else if ('Image Width' in tags) {
      const imageWidth = tags['Image Width'] as ExifTag;
      metadata.width = typeof imageWidth.value === 'number' ? 
        imageWidth.value : Number(imageWidth.description);
    }
    
    if (tags.file && 'Image Height' in tags.file) {
      metadata.height = Number(tags.file['Image Height'].value);
    } else if (tags.exif && 'PixelYDimension' in tags.exif) {
      metadata.height = Number(tags.exif.PixelYDimension.value);
    } else if ('Image Height' in tags) {
      const imageHeight = tags['Image Height'] as ExifTag;
      metadata.height = typeof imageHeight.value === 'number' ? 
        imageHeight.value : Number(imageHeight.description);
    }
    
    // Camera information
    if (tags.exif && 'Make' in tags.exif) {
      metadata.make = tags.exif.Make.description || String(tags.exif.Make.value);
    } else if ('Make' in tags) {
      const make = tags['Make'] as ExifTag;
      metadata.make = make.description || String(make.value);
    }
    
    if (tags.exif && 'Model' in tags.exif) {
      metadata.model = tags.exif.Model.description || String(tags.exif.Model.value);
    } else if ('Model' in tags) {
      const model = tags['Model'] as ExifTag;
      metadata.model = model.description || String(model.value);
    }
    
    // Orientation
    if (tags.exif && 'Orientation' in tags.exif) {
      metadata.orientation = tags.exif.Orientation.description || String(tags.exif.Orientation.value);
    } else if ('Orientation' in tags) {
      const orientation = tags['Orientation'] as ExifTag;
      metadata.orientation = orientation.description || String(orientation.value);
    }
    
    // Software
    if (tags.exif && 'Software' in tags.exif) {
      metadata.software = tags.exif.Software.description || String(tags.exif.Software.value);
    } else if ('Software' in tags) {
      const software = tags['Software'] as ExifTag;
      metadata.software = software.description || String(software.value);
    }
    
    // Date
    if (tags.exif && 'DateTime' in tags.exif) {
      metadata.dateTime = tags.exif.DateTime.description || String(tags.exif.DateTime.value);
    } else if ('DateTime' in tags) {
      const dateTime = tags['DateTime'] as ExifTag;
      metadata.dateTime = dateTime.description || String(dateTime.value);
    }
    
    // GPS data
    if (tags.gps) {
      try {
        // GPS data is in the expanded format
        if ('Latitude' in tags.gps && 'GPSLatitudeRef' in tags.gps) {
          const latValue = tags.gps.Latitude.value;
          const latRef = tags.gps.GPSLatitudeRef.value;
          
          if (Array.isArray(latValue) && latValue.length >= 3) {
            metadata.gpsLatitude = convertGPSToDecimal(
              [Number(latValue[0]), Number(latValue[1]), Number(latValue[2])], 
              String(latRef)
            );
          }
        }
        
        if ('Longitude' in tags.gps && 'GPSLongitudeRef' in tags.gps) {
          const longValue = tags.gps.Longitude.value;
          const longRef = tags.gps.GPSLongitudeRef.value;
          
          if (Array.isArray(longValue) && longValue.length >= 3) {
            metadata.gpsLongitude = convertGPSToDecimal(
              [Number(longValue[0]), Number(longValue[1]), Number(longValue[2])], 
              String(longRef)
            );
          }
        }
        
        if ('GPSAltitude' in tags.gps) {
          metadata.gpsAltitude = Number(tags.gps.GPSAltitude.value);
        }
      } catch (e) {
        console.error("Error parsing GPS data:", e);
      }
    } else {
      // Try the old format for GPS data
      try {
        if ('GPSLatitude' in tags && 'GPSLatitudeRef' in tags) {
          const latValue = (tags['GPSLatitude'] as ExifTag).value;
          const latRef = (tags['GPSLatitudeRef'] as ExifTag).value;
          
          if (Array.isArray(latValue) && latValue.length >= 3) {
            metadata.gpsLatitude = convertGPSToDecimal(
              [Number(latValue[0]), Number(latValue[1]), Number(latValue[2])], 
              String(latRef)
            );
          }
        }
        
        if ('GPSLongitude' in tags && 'GPSLongitudeRef' in tags) {
          const longValue = (tags['GPSLongitude'] as ExifTag).value;
          const longRef = (tags['GPSLongitudeRef'] as ExifTag).value;
          
          if (Array.isArray(longValue) && longValue.length >= 3) {
            metadata.gpsLongitude = convertGPSToDecimal(
              [Number(longValue[0]), Number(longValue[1]), Number(longValue[2])], 
              String(longRef)
            );
          }
        }
        
        if ('GPSAltitude' in tags) {
          metadata.gpsAltitude = Number((tags['GPSAltitude'] as ExifTag).value);
        }
      } catch (e) {
        console.error("Error parsing GPS data (old format):", e);
      }
    }
    
    // Camera settings
    if (tags.exif) {
      if ('ExposureTime' in tags.exif) {
        metadata.exposureTime = tags.exif.ExposureTime.description || String(tags.exif.ExposureTime.value);
      }
      
      if ('FNumber' in tags.exif) {
        metadata.fNumber = typeof tags.exif.FNumber.value === 'number' ? 
          tags.exif.FNumber.value : Number(tags.exif.FNumber.description);
      }
      
      if ('ISOSpeedRatings' in tags.exif) {
        metadata.iso = typeof tags.exif.ISOSpeedRatings.value === 'number' ? 
          tags.exif.ISOSpeedRatings.value : Number(tags.exif.ISOSpeedRatings.description);
      }
      
      if ('FocalLength' in tags.exif) {
        metadata.focalLength = tags.exif.FocalLength.description || String(tags.exif.FocalLength.value);
      }
    } else {
      // Try the old format for camera settings
      if ('ExposureTime' in tags) {
        const exposureTime = tags['ExposureTime'] as ExifTag;
        metadata.exposureTime = exposureTime.description || String(exposureTime.value);
      }
      
      if ('FNumber' in tags) {
        const fNumber = tags['FNumber'] as ExifTag;
        metadata.fNumber = typeof fNumber.value === 'number' ? 
          fNumber.value : Number(fNumber.description);
      }
      
      if ('ISOSpeedRatings' in tags) {
        const isoSpeedRatings = tags['ISOSpeedRatings'] as ExifTag;
        metadata.iso = typeof isoSpeedRatings.value === 'number' ? 
          isoSpeedRatings.value : Number(isoSpeedRatings.description);
      }
      
      if ('FocalLength' in tags) {
        const focalLength = tags['FocalLength'] as ExifTag;
        metadata.focalLength = focalLength.description || String(focalLength.value);
      }
    }
    
    console.log('Extracted image metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error("Error extracting image metadata:", error);
    return {}; // Return empty object if extraction fails
  }
};

/**
 * Extract metadata from a document file
 */
const extractDocumentMetadata = async (file: File): Promise<DocumentMetadata> => {
  // Basic implementation - would need a specific library for PDF/document parsing
  return {
    title: file.name,
    // Other fields would need document-specific parsers
  };
};

/**
 * Extract metadata from an audio file
 */
const extractAudioMetadata = async (file: File): Promise<AudioMetadata> => {
  // Basic implementation - would need audio metadata extraction library
  return {
    // Fields would need audio-specific parsers
  };
};

/**
 * Extract metadata from a video file
 */
const extractVideoMetadata = async (file: File): Promise<VideoMetadata> => {
  // Basic implementation - would need video metadata extraction library
  return {
    // Fields would need video-specific parsers
  };
};

/**
 * Convert GPS coordinates from EXIF format to decimal degrees
 */
const convertGPSToDecimal = (gpsValue: [number, number, number], ref: string): number => {
  const degrees = gpsValue[0];
  const minutes = gpsValue[1];
  const seconds = gpsValue[2];
  
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  
  // If reference is South or West, negate the value
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
}; 
export const SLIDE_IN_ANIMATIONS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
};

export const FADE_IN_ANIMATIONS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const SCALE_ANIMATIONS = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
};

export const CARD_HOVER_ANIMATION = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export const FORENSIC_SCAN_ANIMATION = {
  initial: { height: '0%', opacity: 0.5 },
  animate: { height: '100%', opacity: 0.6 },
  transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }
};

export const PULSE_ANIMATION = {
  initial: { opacity: 0.5, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }
};

export const STAGGER_CHILDREN = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 }
};

// New animations for forensic theme

export const EVIDENCE_ANALYSIS_ANIMATION = {
  initial: { 
    opacity: 0, 
    pathLength: 0, 
    pathOffset: 1 
  },
  animate: { 
    opacity: 1, 
    pathLength: 1, 
    pathOffset: 0 
  },
  transition: { 
    duration: 2, 
    ease: "easeInOut" 
  }
};

export const DATA_SCAN_ANIMATION = {
  initial: { 
    x: -20, 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    x: 0, 
    opacity: 1, 
    scale: 1 
  },
  transition: { 
    type: "spring", 
    stiffness: 260, 
    damping: 20 
  }
};

export const FORENSIC_HIGHLIGHT_ANIMATION = {
  initial: { 
    boxShadow: "0 0 0 0 rgba(88, 80, 236, 0)" 
  },
  animate: { 
    boxShadow: [
      "0 0 0 0 rgba(88, 80, 236, 0)",
      "0 0 0 4px rgba(88, 80, 236, 0.3)",
      "0 0 0 0 rgba(88, 80, 236, 0)"
    ]
  },
  transition: { 
    duration: 2, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

export const VERIFICATION_ANIMATION = {
  initial: { 
    pathLength: 0, 
    opacity: 0 
  },
  animate: { 
    pathLength: 1, 
    opacity: 1 
  },
  transition: { 
    duration: 0.5, 
    ease: "easeIn" 
  }
};

export const HEXDUMP_SCAN_ANIMATION = {
  initial: { 
    backgroundPosition: '0% 0%', 
    opacity: 0.2
  },
  animate: { 
    backgroundPosition: ['0% 0%', '100% 100%'], 
    opacity: [0.2, 0.5, 0.2]
  },
  transition: { 
    duration: 8, 
    repeat: Infinity, 
    ease: "linear" 
  }
};

export const FORENSIC_PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}; 
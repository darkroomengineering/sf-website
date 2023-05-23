import { create } from 'zustand'

export const useStore = create((set) => ({
  navIsOpen: false,
  setNavIsOpen: (toggle) => set({ navIsOpen: toggle, overflow: !toggle }),
  contactIsOpen: false,
  setContactIsOpen: (toggle) =>
    set({ contactIsOpen: toggle, overflow: !toggle }),
  selectedProject: false,
  setSelectedProject: (value) => set({ selectedProject: value }),
  galleryVisible: false,
  setGalleryVisible: (value) => set({ galleryVisible: value }),
  showThanks: false,
  setShowThanks: (showThanks) => set({ showThanks }),
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  overflow: true,
  setOverflow: (overflow) => set({ overflow }),
  triggerTransition: '',
  setTriggerTransition: (triggerTransition) => set({ triggerTransition }),
}))

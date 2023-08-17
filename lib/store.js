// import { create } from 'zustand'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

export const useStore = createWithEqualityFn(
  (set) => ({
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
  }),
  shallow,
)

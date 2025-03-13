import { create } from "zustand";
import { shallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Diary = {
  id: string,
  date: string,
  [key: string]: any
}[]

export type Assignments = {
  id: string,
  date: string,
  [key: string]: any
}[]

export type Steps = string[]

export type Sorks = {
  id: string,
  date: string,
  [key: string]: any
}[]

export type ExpandLifeSpaces = {
  id: string,
  date: string,
  [key: string]: any
}[]

export interface StoreState {
  data: {
    diary: Diary
    steps: Steps
    assignments: Assignments
    sorks: Sorks
    expandLifeSpaces: ExpandLifeSpaces
    [key: string]: any
  },
  theme: 'light' | 'dark',
  setTheme: (theme: 'light' | 'dark') => void,
  updateData: (data: any, section?: string) => void,
  reset: () => void
  resetKeys: (keys: string[], section?: string) => void
}

const defaultState = {
  diary: [],
  steps: [],
  assignments: [],
  sorks: [],
  expandLifeSpaces: []
}

const useStore = create(persist<StoreState>((set, get) => ({
  theme: 'dark',
  data: defaultState,
  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({ theme }))
  },
  updateData: (data, section) => {

    let d = { ...get().data }
    if (section)
      d[section] = Array.isArray(data) ? data : { ...d[section], ...data }
    else
      d = Array.isArray(data) ? data : { ...d, ...data }

    set((state) => ({ data: d }))
  },
  reset: () => set((state) => ({ data: defaultState })),
  resetKeys: (keys, section) => {
    if (!keys) return

    let d = get().data

    if (keys)
      keys.forEach((key) => section && d[section]?.[key] !== undefined ? delete d[section][key] : delete d[key])
    else
      d = defaultState

    set((state) => ({ data: d }))
  },
}), {
  version: 1,
  name: 'sof',
  storage: createJSONStorage(() => AsyncStorage)
}));

export { shallow, useStore };
export default useStore

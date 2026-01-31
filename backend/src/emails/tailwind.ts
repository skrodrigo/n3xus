import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export const emailTailwindConfig: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        bg: '#141414',
        panel: '#181818',
        brand: '#25D2AC',
        brand2: '#1A876F',
        highlight: '#437204',
        text: '#EDEDED',
        muted: '#B7B7B7',
      },
    },
  },
};

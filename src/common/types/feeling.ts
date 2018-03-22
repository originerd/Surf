export type FeelingTypes =
  'angry' |
  'excited' |
  'happy' |
  'sad' |
  'scared' |
  'tender';

export const Feelings: { [feelingType in FeelingTypes]: string } = {
  angry: '화남',
  excited: '기대',
  happy: '행복',
  tender: '감동',
  sad: '슬픔',
  scared: '무서움',
};

export const FeelingTypes = Object.keys(Feelings) as FeelingTypes[];

export type FeelingTypes =
  'angry' |
  'excited' |
  'happy' |
  'sad' |
  'scared' |
  'tender';

export const Feelings: { [feelingType in FeelingTypes]: string } = {
  angry: 'Angry',
  excited: 'Excited',
  happy: 'Happy',
  sad: 'Sad',
  scared: 'Scared',
  tender: 'Tender',
};

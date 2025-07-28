// src/context/utils.js

export function randomLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export function corruptWord(word) {
  if (word.length < 2) return word;
  const index = Math.floor(Math.random() * word.length);
  return word.substring(0, index) + randomLetter() + word.substring(index + 1);
}

export function generateWordOptions(correctWord) {
  const wrong1 = corruptWord(correctWord);
  let wrong2 = corruptWord(correctWord);
  while (wrong1 === wrong2 || wrong2 === correctWord) {
    wrong2 = corruptWord(correctWord);
  }
  const options = [correctWord, wrong1, wrong2];
  return options.sort(() => Math.random() - 0.5);
}

export async function loadWords(level = "elementary") {
  const words = [];
  for (let i = 0; i <= 10; i++) {
    try {
      const res = await fetch(`/data/${level}/unit${i}.json`);
      if (res.ok) {
        const unitWords = await res.json();
        words.push(...unitWords);
      }
    } catch (e) {
      console.warn(`Не удалось загрузить unit${i}.json`);
    }
  }
  return words;
}

export function uid() {
  return Math.random().toString(36).substring(2, 9);
}

import { Howl } from "howler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const BASE_URL = "http://localhost:8000";

class AudioService {
  // private soundEffectsVolume: number;
  private musicVolume: number;
  private speechVolume: number;
  private currentLanguage: string;

  // private sounds: Record<string, Howl>;
  private music: Howl | null;

  constructor() {
    // this.soundEffectsVolume = 1; // от 0 до 1
    this.musicVolume = 0.5; // от 0 до 1
    this.speechVolume = 1; // от 0 до 1
    this.currentLanguage = "ru-RU"; // Язык по умолчанию
    // this.currentLanguage = "en-US"; // Язык по умолчанию

    // this.sounds = {
    //   correct: new Howl({ src: [`${BASE_URL}/media/sounds/correct.wav`], volume: this.soundEffectsVolume }),
    //   incorrect: new Howl({ src: [`${BASE_URL}/media/sounds/incorrect.mp3`], volume: this.soundEffectsVolume }),
    //   taskCompleted: new Howl({
    //     src: [`${BASE_URL}/media/sounds/task_completed.wav`],
    //     volume: this.soundEffectsVolume,
    //   }),
    // };

    this.music = null;
  }

  // Методы управления звуковыми эффектами
  // playSoundEffect(effect: "correct" | "incorrect" | "taskCompleted"): void {
  //   const sound = this.sounds[effect];
  //   if (sound) {
  //     sound.volume(this.soundEffectsVolume);
  //     sound.play();
  //   }
  // }

  // Воспроизведение музыки
  playMusic(path: string): void {
    const src = `${BASE_URL}${path}`; // Добавляем BASE_URL к пути
    if (this.music) {
      this.music.stop();
    }

    this.music = new Howl({ src: [src], loop: true, volume: this.musicVolume });
    this.music.play();
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(volume, 1));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
  }

  // Методы управления речью
  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.volume = this.speechVolume;
    speechSynthesis.speak(utterance);
  }

  setSpeechLanguage(language: string): void {
    this.currentLanguage = language;
  }

  setSpeechVolume(volume: number): void {
    this.speechVolume = Math.max(0, Math.min(volume, 1));
  }

  // Методы управления громкостью звуковых эффектов
  setSoundEffectsVolume(): void {
  // setSoundEffectsVolume(volume: number): void {
    // this.soundEffectsVolume = Math.max(0, Math.min(volume, 1));
    // Object.values(this.sounds).forEach(sound => sound.volume(this.soundEffectsVolume));
  }
}

export const audioService = new AudioService();

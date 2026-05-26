export class BirthdayWishes {
    public static getWishes(): string[] {
        return [
            "🎉 Happy Birthday! Wishing you happiness, success, and a wonderful celebration today! 🎂",
            "🥳 Happy Birthday! May your special day be filled with joy, laughter, and positivity! ✨",
            "💖 Wishing you a very Happy Birthday and a year full of success and happiness ahead! 🎈",
            "🌟 Happy Birthday! Hope your day is filled with great memories, smiles, and celebration! 🎊",
            "🎂 Wishing you joy, good health, and continued success on your special day today! 💐",
            "✨ Happy Birthday! May this year bring you happiness, achievements, and endless positivity! 🎉",
            "💫 Warm birthday wishes to you for a cheerful day and a successful year ahead! 🌸",
            "🙌 Many happy returns of the day! Wishing you happiness, success, and great moments! 🎁"
        ];
    }

    public static getRandomWish(): string {
        const wishes = this.getWishes();
        return wishes[Math.floor(Math.random() * wishes.length)];
    }
}

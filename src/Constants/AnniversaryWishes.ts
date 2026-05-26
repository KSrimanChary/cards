export class AnniversaryWishes {
    public static getWishes(): string[] {
        return [
            "💖 Happy Anniversary! Wishing you both endless happiness, love, and beautiful memories together! 🎉",
            "🥂 Congratulations on your anniversary! May your journey together always stay joyful and strong! ❤️",
            "✨ Happy Anniversary! Wishing you both a lifetime filled with love, happiness, and togetherness! 💕",
            "💐 Warm anniversary wishes to you both for many more happy and memorable years ahead! 🎊",
            "❤️ Happy Anniversary! May your bond continue to grow stronger and happier every year! 🌸",
            "🎉 Wishing you both a joyful anniversary filled with love, laughter, and special moments! 💑",
            "🌟 Happy Anniversary! May this special occasion bring happiness, peace, and lasting love! 💖",
            "🥳 Congratulations on another wonderful year together! Wishing you love and happiness always! 🎂"
        ];
    }

    public static getRandomWish(): string {
        const wishes = this.getWishes();
        return wishes[Math.floor(Math.random() * wishes.length)];
    }
}
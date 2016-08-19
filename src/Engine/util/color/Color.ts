class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public h: number;
    public s: number;
    public v: number;

    public constructor(r: any, g: number, b: number, a: number = 255) {
        this.r = r,this.g = g,this.b = b,this.a = a;
        this.hsv();
    }

    public get hex(): string {
        let hexr = this.r.toString(16);
        let hexg = this.g.toString(16);
        let hexb = this.b.toString(16);
        let r = hexr.length == 1 ? '0' + hexr : hexr;
        let g = hexg.length == 1 ? '0' + hexg : hexg;
        let b = hexb.length == 1 ? '0' + hexb : hexb;
        return r.toString() + g.toString() + b.toString();
    }

    protected hsv() {
        let r = this.r / 255, g = this.g / 255, b = this.b / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;

        let d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        this.h = Math.round(h * 360);
        this.s = Math.round(s * 100);
        this.v = Math.round(v * 100);
    }

    public static fromHsv(h: number, s: number, v: number): Color {
        h /= 360, s /= 100, v /= 100;
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    public static fromHex(hexCode: string): Color {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hexCode = hexCode.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        return result ? new Color(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ) : null;
    }

    public get invert(): Color {
        let r: number = Math.abs(this.r - 255);
        let g: number = Math.abs(this.g - 255);
        let b: number = Math.abs(this.b - 255);
        return new Color(r, g, b);
    }

    public get luminance(): number {
        return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b;
    }

    public get grayscale(): number {
        return (this.r + this.g + this.b) / 3;
    }

    public get maxColorComponent(): number {
        return Math.max(this.r, this.g, this.b);
    }

    // Reds
    public static get indianRed(): Color { return new Color(205, 92, 92); }
    public static get lightCoral(): Color { return new Color(240, 128, 128); }
    public static get salmon(): Color { return new Color(250, 128, 114); }
    public static get darkSalmon(): Color { return new Color(233, 150, 122); }
    public static get crimson(): Color { return new Color(220, 20, 60); }
    public static get red(): Color { return new Color(255, 0, 0); }
    public static get firebrick(): Color { return new Color(178, 34, 34); }
    public static get darkRed(): Color { return new Color(139, 0, 0); }

    // Pinks
    public static get pink(): Color { return new Color(255, 192, 203); }
    public static get lightPink(): Color { return new Color(255, 182, 193); }
    public static get hotPink(): Color { return new Color(255, 105, 180); }
    public static get deepPink(): Color { return new Color(255, 20, 147); }
    public static get mediumViolet(): Color { return new Color(199, 21, 133); }
    public static get paleViolet(): Color { return new Color(219, 112, 147); }

    //Oranges
    public static get lightSalmon(): Color { return new Color(255, 160, 122); }
    public static get coral(): Color { return new Color(255, 127, 80); }
    public static get tomato(): Color { return new Color(255, 99, 71); }
    public static get orangeRed(): Color { return new Color(255, 69, 0); }
    public static get darkOrange(): Color { return new Color(255, 140, 0); }
    public static get orange(): Color { return new Color(255, 165, 0); }

    // Yellows
    public static get gold(): Color { return new Color(255, 215, 0); }
    public static get yellow(): Color { return new Color(255, 215, 0); }
    public static get lightYellow(): Color { return new Color(255, 255, 224); }
    public static get lemonChiffon(): Color { return new Color(255, 250, 205); }
    public static get lightGoldenRodYellow(): Color { return new Color(250, 250, 210); }
    public static get papayWhip(): Color { return new Color(255, 239, 213); }
    public static get moccasin(): Color { return new Color(255, 228, 181); }
    public static get peachPuff(): Color { return new Color(255, 218, 185); }
    public static get paleGoldenRod(): Color { return new Color(238, 232, 170); }
    public static get khaki(): Color { return new Color(240, 230, 140); }
    public static get darkKhaki(): Color { return new Color(189, 183, 107); }

    // Purples
    public static get lavender(): Color { return new Color(230, 230, 250); }
    public static get thistle(): Color { return new Color(216, 191, 216); }
    public static get plum(): Color { return new Color(221, 160, 221); }
    public static get violet(): Color { return new Color(238, 130, 238); }
    public static get orchid(): Color { return new Color(218, 112, 214); }
    public static get fuchsia(): Color { return new Color(255, 0, 255); }
    public static get magenta(): Color { return new Color(255, 0, 255); }
    public static get mediumOrchid(): Color { return new Color(186, 85, 211); }
    public static get mediumPurple(): Color { return new Color(147, 112, 219); }
    public static get rebeccaPurple(): Color { return new Color(102, 51, 153); }
    public static get blueViolet(): Color { return new Color(138, 43, 226); }
    public static get darkViolet(): Color { return new Color(148, 0, 211); }
    public static get darkOrchid(): Color { return new Color(153, 50, 204); }
    public static get darkMagenta(): Color { return new Color(139, 0, 139); }
    public static get purple(): Color { return new Color(128, 0, 128); }
    public static get indigo(): Color { return new Color(75, 0, 130); }
    public static get slateBlue(): Color { return new Color(106, 90, 205); }
    public static get darkSlateBlue(): Color { return new Color(72, 61, 139); }

    // Greens
    public static get greenYellow(): Color { return new Color(173, 255, 47); }
    public static get chartreuse(): Color { return new Color(127, 255, 0); }
    public static get lawnGreen(): Color { return new Color(124, 252, 0); }
    public static get lime(): Color { return new Color(0, 255, 0); }
    public static get limeGreen(): Color { return new Color(50, 205, 50); }
    public static get paleGreen(): Color { return new Color(152, 251, 152); }
    public static get lightGreen(): Color { return new Color(144, 238, 144); }
    public static get mediumSpringGreen(): Color { return new Color(0, 250, 154); }
    public static get springGreen(): Color { return new Color(0, 255, 127); }
    public static get mediumSeaGreen(): Color { return new Color(60, 179, 113); }
    public static get seaGreen(): Color { return new Color(60, 179, 113); }
    public static get forestGreen(): Color { return new Color(34, 139, 34); }
    public static get green(): Color { return new Color(0, 128, 0); }
    public static get darkGreen(): Color { return new Color(0, 100, 0); }
    public static get yellowGreen(): Color { return new Color(154, 205, 50); }
    public static get oliveDrab(): Color { return new Color(107, 142, 35); }
    public static get olive(): Color { return new Color(128, 128, 0); }
    public static get darkOliveGreen(): Color { return new Color(85, 107, 47); }
    public static get mediumAquaMarine(): Color { return new Color(102, 205, 170); }
    public static get darkSeaGreen(): Color { return new Color(143, 188, 139); }
    public static get lightSeaGreen(): Color { return new Color(32, 178, 170); }
    public static get darkCyan(): Color { return new Color(0, 139, 139); }
    public static get teal(): Color { return new Color(0, 128, 128); }

    // Blues
    public static get cyan(): Color { return new Color(0, 255, 255); }
    public static get lightCyan(): Color { return new Color(224, 255, 255); }
    public static get paleTurquoise(): Color { return new Color(175, 238, 238); }
    public static get aquaMarine(): Color { return new Color(127, 255, 212); }
    public static get turquoise(): Color { return new Color(64, 224, 208); }
    public static get mediumTurquoise(): Color { return new Color(72, 209, 204); }
    public static get darkTurquoise(): Color { return new Color(0, 206, 209); }
    public static get cadetBlue(): Color { return new Color(95, 158, 160); }
    public static get steelBlue(): Color { return new Color(70, 130, 180); }
    public static get lightSteelBlue(): Color { return new Color(176, 196, 222); }
    public static get powderBlue(): Color { return new Color(176, 224, 230); }
    public static get lightBlue(): Color { return new Color(173, 216, 230); }
    public static get skyBlue(): Color { return new Color(135, 206, 235); }
    public static get lightSkyBlue(): Color { return new Color(135, 206, 250); }
    public static get deepSkyBlue(): Color { return new Color(0, 191, 255); }
    public static get dodgerBlue(): Color { return new Color(30, 144, 255); }
    public static get cornFlowerBlue(): Color { return new Color(100, 149, 237); }
    public static get mediumSlateBlue(): Color { return new Color(123, 104, 238); }
    public static get royalBlue(): Color { return new Color(65, 105, 225); }
    public static get blue(): Color { return new Color(0, 0, 255); }
    public static get mediumBlue(): Color { return new Color(0, 0, 205); }
    public static get darkBlue(): Color { return new Color(0, 0, 139); }
    public static get navy(): Color { return new Color(0, 0, 128); }
    public static get midnightBlue(): Color { return new Color(25, 25, 112); }
    public static get blueberry(): Color { return new Color(79, 134, 247); }

    // Browns
    public static get cornSilk(): Color { return new Color(255, 248, 220); }
    public static get blanchedAlmond(): Color { return new Color(255, 235, 205); }
    public static get bisque(): Color { return new Color(255, 228, 196); }
    public static get navajoWhite(): Color { return new Color(255, 222, 173); }
    public static get wheat(): Color { return new Color(245, 222, 179); }
    public static get burlyWood(): Color { return new Color(222, 184, 135); }
    public static get tan(): Color { return new Color(210, 180, 140); }
    public static get rosyBrown(): Color { return new Color(188, 143, 143); }
    public static get sandyBrown(): Color { return new Color(244, 164, 96); }
    public static get goldenRod(): Color { return new Color(218, 165, 32); }
    public static get darkGoldenRod(): Color { return new Color(184, 134, 11); }
    public static get peru(): Color { return new Color(205, 133, 63); }
    public static get chocolate(): Color { return new Color(210, 105, 30); }
    public static get saddleBrown(): Color { return new Color(139, 69, 19); }
    public static get sienna(): Color { return new Color(160, 82, 45); }
    public static get brown(): Color { return new Color(165, 42, 42); }
    public static get maroon(): Color { return new Color(128, 0, 0); }

    // Whites
    public static get white(): Color { return new Color(255, 255, 255); }
    public static get snow(): Color { return new Color(255, 250, 250); }
    public static get honeyDew(): Color { return new Color(240, 255, 240); }
    public static get mintCream(): Color { return new Color(245, 255, 250); }
    public static get azure(): Color { return new Color(240, 255, 255); }
    public static get aliceBlue(): Color { return new Color(240, 248, 255); }
    public static get ghostWhite(): Color { return new Color(248, 248, 255); }
    public static get whiteSmoke(): Color { return new Color(245, 245, 245); }
    public static get seaShell(): Color { return new Color(255, 245, 238); }
    public static get beige(): Color { return new Color(245, 245, 220); }
    public static get oldLace(): Color { return new Color(253, 245, 230); }
    public static get floralWhite(): Color { return new Color(255, 250, 240); }
    public static get ivory(): Color { return new Color(255, 255, 240); }
    public static get antiqueWhite(): Color { return new Color(250, 235, 215); }
    public static get linen(): Color { return new Color(250, 240, 230); }
    public static get lavenderBlush(): Color { return new Color(255, 240, 245); }
    public static get mistyRose(): Color { return new Color(255, 228, 225); }

    // Grays
    public static get gainsBoro(): Color { return new Color(220, 220, 220); }
    public static get lightGray(): Color { return new Color(211, 211, 211); }
    public static get silver(): Color { return new Color(192, 192, 192); }
    public static get darkGray(): Color { return new Color(169, 169, 169); }
    public static get gray(): Color { return new Color(128, 128, 128); }
    public static get dimGray(): Color { return new Color(105, 105, 105); }
    public static get lightSlateGray(): Color { return new Color(119, 136, 153); }
    public static get slateGray(): Color { return new Color(112, 128, 144); }
    public static get darkSlateGray(): Color { return new Color(47, 79, 79); }
    public static get black(): Color { return new Color(0, 0, 0); }

}
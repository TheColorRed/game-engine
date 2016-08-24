class Sprite {

    public name: string = '';

    protected _image: HTMLImageElement = null;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _path: string = '';

    public constructor(file?: string) {
        if (file) {
            this.setImage(file);
        }
    }

    public setImage(file: string) {
        this._path = file;
        let img = this._image = new Image();
        img.src = file;
        img.onload = function () {
            this.width = img.width;
            this.height = img.height;
        }
    }

    public get image(): HTMLImageElement { return this._image; }
    public get width(): number { return this._height; }
    public get height(): number { return this._width; }
    public get path(): string { return this._path; }

    public static create(file: string): Sprite {
        return new Sprite(file);
    }

}
class Move extends Component {

    @range(0, 360)
    @steps(0, 45, 90, 135, 180, 225, 270, 315, 360)
    @tooltip('The direction in which the object moves')
    public direction: number = 0;

    @tooltip('The speed at which the object moves')
    public speed: number = 0;

    public update() {
        if (this.eventSystem.hasEventTriggered(this.eventSystem.event)) {
            this.updateTransform();
        }
    }

    private updateTransform() {
        let x = Math.cos(this.direction * Math.PI / 180);
        let y = Math.sin(this.direction * Math.PI / 180);
        this.transform.translate((new Vector2(x, y)).times(this.speed).times(Time.deltaTime));
    }

}
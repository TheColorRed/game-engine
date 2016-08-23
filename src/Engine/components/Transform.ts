class Transform extends Component {

    public position: Vector2 = Vector3.zero;
    public rotation: Vector3 = Vector3.zero;
    public scale: Vector3 = Vector3.zero;

    public parent: Transform;

    public translate(translation: Vector2) {
        this.position = translation;
    }

}
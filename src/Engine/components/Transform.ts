class Transform extends Component {

    public position: Vector3 = Vector3.zero;
    public rotation: Vector3 = Vector3.zero;
    public scale: Vector3 = Vector3.zero;

    public parent: Transform;

    public translate(translation: Vector3) {
        this.position = translation;
    }

}
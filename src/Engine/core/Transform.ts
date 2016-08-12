class Transform extends Component {

    @serializable()
    public position: Vector3 = Vector3.zero;

    @serializable()
    public rotation: Vector3 = Vector3.zero;

    @serializable()
    public scale: Vector3 = Vector3.zero;

    public translate(translation: Vector3) {

    }

}
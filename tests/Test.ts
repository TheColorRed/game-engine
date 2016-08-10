class Test extends MonoBehavior {

    public awake() {
        Debug.log('awake');
    }

    public start() {
        Debug.log('start');
    }

    public update() {
        let cam = this.gameObject.getComponent(Camera);
        Debug.log('update');
    }

}
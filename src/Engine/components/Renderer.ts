abstract class Renderer extends Component {

    @tooltip('The order to display the Render. \n0 is displayed on the bottom; \n1 is displayed on top of 0; \n2 is displayed on top of 1; \netc.')
    public depth: number = 0;

}
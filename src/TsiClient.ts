import UXClient from "./UXClient/UXClient";
import Utils from "./UXClient/Utils";

class TsiClient {
    public ux = new UXClient();
    public utils = Utils;
}
export default TsiClient;

(<any>window).TsiClient = TsiClient;
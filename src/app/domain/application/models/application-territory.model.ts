import {Resource} from "@app/core/hal/resource/resource.model";

import {Application} from "./application.model";
import {Territory} from "../../territory/models/territory.model";

export class ApplicationTerritory extends Resource {
  public override id: number;
  public application: Application;
  public territory: Territory;
  public initialExtent: any;
}

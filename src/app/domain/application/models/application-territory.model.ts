import {Application, Territory} from "@app/domain";
import {Resource} from "@app/core";

export class ApplicationTerritory extends Resource {
  public override id: number;
  public application: Application;
  public territory: Territory;
  public initialExtent: any;
}

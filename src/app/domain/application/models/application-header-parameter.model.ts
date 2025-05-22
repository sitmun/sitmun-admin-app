import {Resource} from "@app/core";

export class ApplicationHeaderParameter extends Resource {
  public name: string;
  public visible: boolean;
  public url : string;
  public section : string;

  public static fromObject(source: any): ApplicationHeaderParameter {
    const param = new ApplicationHeaderParameter();

    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // ApplicationParameter properties
      'id', 'name', 'visible', 'url', 'section'
    ];

    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        param[prop] = source[prop];
      }
    });

    return param;
  }

}

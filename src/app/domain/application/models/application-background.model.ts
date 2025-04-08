import { Resource } from '@app/core/hal/resource/resource.model';
import {Background, BackgroundProjection} from '@app/domain';
import {Application, ApplicationProjection} from '@app/domain';

/**
 * Application background model
 */

export class ApplicationBackground extends Resource {
  public id: number;
  public application: Application;
  public background: Background;
  public order: number;

  static of(
    application: Application,
    background: Background,
    order: number): ApplicationBackground {
    const item = new ApplicationBackground();
    item.application = application;
    item.background = background;
    item.order = order;
    return item;
  }
}

export class ApplicationBackgroundProjection extends Resource {
  id: number;
  order: number;
  backgroundName: string;
  backgroundId: number;
  applicationName: string;
  applicationId: number;
  backgroundDescription: string;

  static of(
    application: ApplicationProjection,
    background: BackgroundProjection,
    order: number
  ) : ApplicationBackgroundProjection {
    const item = new ApplicationBackgroundProjection();
    item.order = order;
    item.applicationId = application.id;
    item.applicationName = application.name;
    item.backgroundId = background.id;
    item.backgroundName = background.name;
    return item;
  }
}


"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactCircleCard from "./component/ReactCircleCard";
import { State } from "./interfaces";

import "./../style/visual.less";

import IViewport = powerbi.IViewport;

export class Visual implements IVisual {
  private target: HTMLElement;
  private viewport: IViewport;
  private updateState: (newState: State) => void;

  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
  constructor(options: VisualConstructorOptions) {
    this.formattingSettingsService = new FormattingSettingsService();

    this.updateState = () => {};

    const reactRoot = React.createElement(ReactCircleCard, {
      updateCallback: (updateFunc: (newState: State) => void) => {
        this.updateState = updateFunc;
      },
    });

    this.target = options.element;
    ReactDOM.render(reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    this.viewport = options.viewport;
    const { width, height } = this.viewport;
    const size = Math.min(width, height);

    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );
    const circleSettings = this.formattingSettings.circleCard;

    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];

      this.updateState({
        textLabel: dataView.metadata.columns[0].displayName,
        textValue: dataView.single.value.toString(),
        size: size,
        borderWidth: circleSettings.circleThickness.value,
        background: circleSettings.circleColor.value.value,
      });
    } else {
      this.updateState({
        textLabel: "",
        textValue: "",
        size: size,
        borderWidth: circleSettings.circleThickness.value,
        background: circleSettings.circleColor.value.value,
      });
    }
  }
}

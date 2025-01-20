export interface WidgetData {
  icon: string;
  title: string;
  dataValues?: string[];
  stateValues?: StateValue[];
}

export interface StateValue {
    state: string;
    time: string;
  }
  
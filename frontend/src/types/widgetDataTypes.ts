export interface WidgetData {
  icon: string;
  title: string;
  dataValues?: string[];
  stateValues?: StateValue[];
}

interface StateValue {
    state: string;
    time: string;
  }
  
export enum CustomFieldLabel {
  READY_TO_FULFILL = "ready-to-fulfill",
  PREFERRED_LANGUAGE = "preferred-language",
}

export interface CustomField<TLabel extends CustomFieldLabel, TValue> {
  label: TLabel;
  required: boolean;
  value: TValue;
  defaultValue: TValue;
}

export namespace CustomFieldRegistry {
  export type ReadyToFulfill = CustomField<
    CustomFieldLabel.READY_TO_FULFILL,
    boolean
  >;
}

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { TagHelper } from "Helpers/TagHelper";

const th = new TagHelper();
const Log = LogBuilder.create("Edit tag chip");

@autoinject
export class EditTagChip {
  editing: boolean = false;

  @bindable
  tag: Tag = {
    key: "",
    value: "",
  };
  @bindable
  model: TagEntity;
  @bindable
  namespace: string = "";
  form: HTMLFormElement;

  tagPattern = th.getTagRegEx();

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  chipClicked(e: Event) {
    e.stopPropagation();
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  submitTag() {
    if (!this.form.checkValidity() || !this.tagPattern.test(this.tag.key)) {
      return this.eventAggregator.publish("global:message", { body: "Invalid characters in tag value" });
    }

    this.eventAggregator.publish(`${this.namespace}:tag:edit`, {
      model: this.model,
      tag: this.tag,
    });
    this.editing = false;
  }

  deleteTag() {
    Log.debug("Event emitting", `${this.namespace}:tag:delete`, {
      model: this.model,
      tag: this.tag,
    });
    this.eventAggregator.publish(`${this.namespace}:tag:delete`, {
      model: this.model,
      tag: this.tag,
    });
  }
}

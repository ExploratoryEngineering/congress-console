/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

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

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
import { autoinject, bindable } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { TagHelper } from "Helpers/TagHelper";

const th = new TagHelper();

const Log = LogBuilder.create("Create new tag chip");

@autoinject
export class CreateNewTagChip {
  editing: boolean = false;
  tag: Tag = {
    key: "",
    value: "",
  };

  @bindable
  model: any;

  @bindable
  namespace: string = "";

  inputElement: HTMLInputElement;
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

    if (this.editing) {
      this.tag.key = "";
      this.tag.value = "";
    }
  }

  submitTag() {
    if (!this.form.checkValidity() || !this.tagPattern.test(this.tag.key) || !this.tagPattern.test(this.tag.value)) {
      return this.eventAggregator.publish("global:message", { body: "Invalid characters in tag name and/or value" });
    }
    this.eventAggregator.publish(`${this.namespace}:tag:new`, {
      model: this.model,
      tag: this.tag,
    });
    this.toggleEditing();
  }
}

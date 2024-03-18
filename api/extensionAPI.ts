/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const registeredExtensions: extension[] = [];

export interface extension {
  name: string;
  template: string;
  methods?: string[];
  mountsOn: string;
  main: string;
}

const registerExtension = (component: extension) => {
  const c = component;
  console.log(Function.prototype.toString.call(c.main));
  registeredExtensions.push();
};

const getRegisteredExtensions = () => {
  return registeredExtensions;
};

export { registerExtension, getRegisteredExtensions };

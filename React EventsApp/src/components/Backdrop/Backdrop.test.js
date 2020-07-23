import React from 'react';

import { shallow } from 'enzyme';

import Backdrop from "./Backdrop";

describe("<Backdrop />", () => {
    it("expect to match snapshot", () => {
        expect(shallow(<Backdrop/>)).toMatchSnapshot();
    });
});

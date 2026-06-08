/* eslint-disable no-undef, comma-dangle */
// import Suitelet from 'SuiterScripts/ESP/STC-H2-Lookups/esp_sl_openapi_index';

// import search from 'N/search';
// import SearchInstance from 'N/search/instance';
// import SearchResultSet from 'N/search/resultset';
// import runtime from 'N/runtime';
// import { ServerResponse } from 'N/https/serverresponse';

// jest.mock('N/search');
// jest.mock('N/search/instance');
// jest.mock('N/search/resultset');
// jest.mock('N/runtime');
// jest.mock('N/https/serverresponse');

jest.mock('N/log', () => ({
  debug: jest.fn(),
  error: jest.fn(),
  audit: jest.fn()
}));


beforeEach(() => {
  jest.clearAllMocks();

  // GIVEN

  // WHEN

  // Trigger a script entry point
  // Suitelet.onRequest(context);
});

describe('have a FEATURE that should SATISFY a NEED for the USER', () => {
  it('SHOULD should search for the currently deployed data lookups', () => {
    // Given
    // When
    // Then
    //     expect.hasAssertions();  // forces a failure if you haven't implemented the test.
  });
  it('SHOULD do some other tangible behaviour regarding the NEED', () => {
    //     expect.hasAssertions();  // forces a failure if you haven't implemented the test.
  });
  it('SHOULD some other useful thing', () => {
    //     expect.hasAssertions();  // forces a failure if you haven't implemented the test.
  });
});
describe('Another useful FEATURE', () => {
  it('SHOULD do another useful thing', () => {
    //     expect.hasAssertions(); // forces a failure if you haven't implemented the test.
  });
});


import ConfigHandler from '..';

describe('ConfigHandler function', () => {
  let event, updateConfig, userFeConfig, setUserFeConfig;

  beforeEach(() => {
    event = { target: { value: 'new value' } };
    updateConfig = 'configToUpdate';
    userFeConfig = { existingConfig: 'existing value' };
    setUserFeConfig = jest.fn();
  });

  it('should update the userFeConfig state with the new value', () => {
    ConfigHandler(event, updateConfig, userFeConfig, setUserFeConfig);
    expect(setUserFeConfig).toHaveBeenCalledWith({
      ...userFeConfig,
      [updateConfig]: event.target.value,
    });
  });

  it('should not modify userFeConfig if updateConfig is undefined', () => {
    ConfigHandler(event, undefined, userFeConfig, setUserFeConfig);
    expect(setUserFeConfig).not.toHaveBeenCalled();
  });
  
  it('should not modify userFeConfig if setUserFeConfig is undefined', () => {
    ConfigHandler(event, updateConfig, userFeConfig, undefined);
    expect(setUserFeConfig).not.toHaveBeenCalled();
  });
});

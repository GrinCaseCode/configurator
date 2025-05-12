import './App.css';
import { useState } from 'react';
import CONFIG_OPTIONS from './configData';
import configuratorImg from './assets/configurator.jpg';


function App() {
  const [config, setConfig] = useState({
    cpu: 0,
    memory: { selectedIndex: 0, quantity: CONFIG_OPTIONS.memory.defaultQuantity },
    raid: 0,
    network: 0,
    lowProfile: 0,
    highProfile: 0,
    rails: 0,
    power: 0,
    disks: [{ index: 0, quantity: CONFIG_OPTIONS.disks.defaultQuantity }]
  });



  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const calcTotal = () => {
    let total = 0;
    total += CONFIG_OPTIONS.cpu.options[config.cpu].price;
    total += CONFIG_OPTIONS.memory.options[config.memory.selectedIndex].price * config.memory.quantity;
    total += CONFIG_OPTIONS.raid.options[config.raid].price;
    total += CONFIG_OPTIONS.network.options[config.network].price;
    total += CONFIG_OPTIONS.lowProfile.options[config.lowProfile].price;
    total += CONFIG_OPTIONS.highProfile.options[config.highProfile].price;
    total += CONFIG_OPTIONS.rails.options[config.rails].price;
    total += CONFIG_OPTIONS.power.options[config.power].price;
    config.disks.forEach(d => {
      total += CONFIG_OPTIONS.disks.options[d.index].price * d.quantity;
    });
    return total;
  };

  const renderSelect = (key, title, options, valueIndex, onChange) => (
    <label className="configurator__item">
      <p>{title}</p>
      <select value={valueIndex} onChange={e => onChange(key, +e.target.value)}>
      <option disabled="disabled">Выберите значение</option>
        {options.map((opt, idx) => (
          <option key={idx} value={idx}>{opt.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="App">
      <div className="configurator">
        <h1 className="configurator__title">{CONFIG_OPTIONS.name}</h1>
        <div className="configurator__row">
          <div className="configurator__image">
            <img src={configuratorImg} alt="alt" />
          </div>
          <div className="configurator__content">
            {renderSelect('cpu', CONFIG_OPTIONS.cpu.title, CONFIG_OPTIONS.cpu.options, config.cpu, handleChange)}

            <label className="configurator__item">
              <p>{CONFIG_OPTIONS.memory.title}</p>
              <div className="configurator__line">
                <div className="configurator__sum">
                  {config.memory.selectedIndex !== null
                    ? config.memory.quantity * CONFIG_OPTIONS.memory.options[config.memory.selectedIndex].valueMemory
                    : 0} GB
                </div>

                <select
                  value={config.memory.selectedIndex ?? ''}
                  onChange={(e) => {
                    const selectedIndex = parseInt(e.target.value, 10);
                    setConfig((prev) => ({
                      ...prev,
                      memory: {
                        ...prev.memory,
                        selectedIndex,
                      },
                    }));
                  }}
                >
                  <option value="" disabled>
                    Выберите значение
                  </option>
                  {CONFIG_OPTIONS.memory.options.map((opt, index) => (
                    <option key={index} value={index}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="quantity">
                  <div
                    className="quantity__btn quantity__btn-down"
                    onClick={() => {
                      setConfig((prev) => {
                        const newQty = Math.max(
                          prev.memory.quantity - CONFIG_OPTIONS.memory.quantityStep,
                          CONFIG_OPTIONS.memory.minQuantity
                        );
                        return {
                          ...prev,
                          memory: {
                            ...prev.memory,
                            quantity: newQty,
                          },
                        };
                      });
                    }}
                  >
                    -
                  </div>
                  <input
                    type="number"
                    step={CONFIG_OPTIONS.memory.quantityStep}
                    min={CONFIG_OPTIONS.memory.minQuantity}
                    value={config.memory.quantity}
                    readOnly
                  />
                  <div
                    className="quantity__btn quantity__btn-up"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        memory: {
                          ...prev.memory,
                          quantity: prev.memory.quantity + CONFIG_OPTIONS.memory.quantityStep,
                        },
                      }));
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
            </label>

            {renderSelect('raid', CONFIG_OPTIONS.raid.title, CONFIG_OPTIONS.raid.options, config.raid, handleChange)}
            {renderSelect('network', CONFIG_OPTIONS.network.title, CONFIG_OPTIONS.network.options, config.network, handleChange)}
            {renderSelect('lowProfile', CONFIG_OPTIONS.lowProfile.title, CONFIG_OPTIONS.lowProfile.options, config.lowProfile, handleChange)}
            {renderSelect('highProfile', CONFIG_OPTIONS.highProfile.title, CONFIG_OPTIONS.highProfile.options, config.highProfile, handleChange)}
            {renderSelect('rails', CONFIG_OPTIONS.rails.title, CONFIG_OPTIONS.rails.options, config.rails, handleChange)}
            {renderSelect('power', CONFIG_OPTIONS.power.title, CONFIG_OPTIONS.power.options, config.power, handleChange)}

            <label className="configurator__item">
              <p>{CONFIG_OPTIONS.disks.title}</p>
              {config.disks.map((disk, i) => (
                <div className="configurator__line" key={i}>
                  <select
                    value={disk.index}
                    onChange={e => {
                      const newDisks = [...config.disks];
                      newDisks[i].index = +e.target.value;
                      setConfig({ ...config, disks: newDisks });
                    }}
                  >
                    {CONFIG_OPTIONS.disks.options.map((opt, idx) => (
                      <option key={idx} value={idx}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="quantity">
                    <div
                      className="quantity__btn quantity__btn-down"
                      onClick={() => {
                        const newDisks = [...config.disks];
                        newDisks[i].quantity = Math.max(CONFIG_OPTIONS.disks.minQuantity, newDisks[i].quantity - CONFIG_OPTIONS.disks.quantityStep);
                        setConfig({ ...config, disks: newDisks });
                      }}
                    >-</div>
                    <input type="number" value={disk.quantity} readOnly />
                    <div
                      className="quantity__btn quantity__btn-up"
                      onClick={() => {
                        const newDisks = [...config.disks];
                        newDisks[i].quantity += CONFIG_OPTIONS.disks.quantityStep;
                        setConfig({ ...config, disks: newDisks });
                      }}
                    >+</div>
                  </div>
                  {i >= 0 && (
                    <div
                      className="btn-remove-line"
                      onClick={() => {
                        const newDisks = config.disks.filter((_, idx) => idx !== i);
                        setConfig({ ...config, disks: newDisks });
                      }}
                    >X</div>
                  )}
                </div>
              ))}
              <div
                className="btn-add-line"
                onClick={() => setConfig({
                  ...config,
                  disks: [...config.disks, { index: 0, quantity: CONFIG_OPTIONS.disks.defaultQuantity }]
                })}
              >
                <strong>+</strong> Добавить еще
              </div>
            </label>
          </div>
        </div>
        <div className="result-price">Стоимость: &nbsp;&nbsp; {calcTotal()} руб.</div>
      </div>
    </div>
  );
}

export default App;
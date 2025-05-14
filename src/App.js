import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import CONFIG_OPTIONS from './configData';
import configuratorImg from './assets/configurator.png';


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

  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
  if (isModalOpen) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }

}, [isModalOpen]);

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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="App">
      <div className="configurator">
        <div className="configurator__row">
          <div className="configurator__main">
            <img src={configuratorImg} alt="alt" />
            <h1 className="configurator__title">{CONFIG_OPTIONS.name}</h1>
            <div className="configurator__descr">Возможно изменить конфигурацию</div>
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
                  {CONFIG_OPTIONS.memory.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
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
                    {CONFIG_OPTIONS.disks.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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
        <div className="result-price">Стоимость: &nbsp;&nbsp; <strong>{calcTotal()} руб.</strong></div>
        <button className="btn-main" onClick={() => setIsModalOpen(true)}>Заказать</button>
        {isModalOpen && (
        <div className="modal">
        <div className="modal__overlay" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal__content">
            <div className="modal__close" onClick={() => setIsModalOpen(false)}>×</div>
            <div className="modal__title">Форма заказа</div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.name}</span>
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.cpu.title}: </span>
              {
                CONFIG_OPTIONS.cpu.options.find(
                  option => option.value === config.cpu
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>Память: </span>
              {
               CONFIG_OPTIONS.memory.options[config.memory.selectedIndex]?.label || 'Нет'  
              } × {config.memory.quantity} шт.
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.raid.title}: </span>
              {
                CONFIG_OPTIONS.raid.options.find(
                  option => option.value === config.raid
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.network.title}: </span>
              {
                CONFIG_OPTIONS.network.options.find(
                  option => option.value === config.network
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.lowProfile.title}: </span>
              {
                CONFIG_OPTIONS.lowProfile.options.find(
                  option => option.value === config.lowProfile
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.highProfile.title}: </span>
              {
                CONFIG_OPTIONS.highProfile.options.find(
                  option => option.value === config.highProfile
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.rails.title}: </span>
              {
                CONFIG_OPTIONS.rails.options.find(
                  option => option.value === config.rails
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.power.title}: </span>
              {
                CONFIG_OPTIONS.power.options.find(
                  option => option.value === config.power
                )?.label || 'Нет'
              }
            </div>
            <div className="modal__feature">
              <span>{CONFIG_OPTIONS.disks.title}: </span>
              {
                config.disks.filter(disk => Number(disk.index) !== 0).length === 0
                  ? 'Нет'
                  : config.disks
                      .filter(disk => Number(disk.index) !== 0)
                      .map((disk, i) => {
                        const diskOption = CONFIG_OPTIONS.disks.options.find(opt => Number(opt.value) === Number(disk.index));
                        return (
                          <div key={i}>
                            {diskOption?.label || 'Не выбрано'} × {disk.quantity} шт.
                          </div>
                        );
                      })
              }
            </div>
            <div className="result-price">Итоговая сумма: &nbsp;<strong>{calcTotal()} руб.</strong></div>
            <br/>
            <form>
                <div className="item-form">
                    <input type="text" required placeholder="Имя" />
                </div>
                <div className="item-form">
                    <input type="email" required placeholder="E-mail" />
                </div>
                <div className="item-form">
                    <input type="tel" required placeholder="Телефон" />
                </div>
                <div className="item-form">
                    <textarea placeholder="Комментарий"></textarea>
                </div>
                <button className='btn-main'>Заказать</button>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
import './App.css';
import { useState, useEffect } from 'react';

function transformItemToConfigOptions(item) {
  const props = item.PROPERTIES;
  const options = {};

  for (const [key, prop] of Object.entries(props)) {
    if (!Array.isArray(prop.values)) continue;

    let values = [...prop.values];

    values = values.filter(v => v.title.toLowerCase() !== 'нет');
    if (key === 'DISKS') {
      values = values.filter(v => v.title.toLowerCase() !== 'выберите значение');
    }

    if ( 
      key !== 'RAM' &&
      values.length > 0 &&
      parseInt(values[0].price || '0') !== 0
    ) {
      values.unshift({
        title: 'Нет',
        price: 0,
        value: 0
      });
    }

    options[key] = {
      ...prop,
      min: prop.min,
      max: prop.max || 999,
      values: values.map((v, i) => ({
        title: v.title,
        price: parseInt(v.price || '0'),
        priceRaw: v.price,
        value: i,
        count: v.count ? parseInt(v.count) : null,
        unitValue: v.value ? parseInt(v.value) : null
      }))
    };
  }

  return options;
}

function App() {
  const [configData, setConfigData] = useState([]);

  useEffect(() => {
    const rootDiv = document.getElementById('root');
    const jsonString = rootDiv?.getAttribute('data-parameters');
    if (!jsonString) return;

    const parsedData = JSON.parse(jsonString);
    const configs = [];

    for (const item of Object.values(parsedData)) {
      const options = transformItemToConfigOptions(item);
      if (Object.keys(options).length === 0) continue;

      const defaultConfig = {};
      for (const [key, prop] of Object.entries(options)) {
        if (prop.multiple) {
          defaultConfig[key] = [{ index: 0, quantity: prop.min || 1 }];
        } else if (key === 'RAM' || prop.count) {
          defaultConfig[key] = { selectedIndex: 0, quantity: prop.chetnoe ? 2 : 1 };
        } else {
          defaultConfig[key] = 0;
        }
      }

      configs.push({
        id: item.ID,
        name: item.NAME,
        image: item.PREVIEW_PICTURE,
        basePrice: parseInt((item.PRICE || '').replace(/\s/g, '')) || 0,
        options,
        config: defaultConfig,
        isModalOpen: false
      });
    }

    setConfigData(configs);
  }, []);

  const updateConfig = (index, newConfig) => {
    setConfigData(prev =>
      prev.map((item, i) => i === index ? { ...item, config: newConfig } : item)
    );
  };

  const setIsModalOpen = (index, open) => {
    setConfigData(prev =>
      prev.map((item, i) => i === index ? { ...item, isModalOpen: open } : item)
    );
  };

  const calcTotal = (item) => {
    const { config, options, basePrice } = item;
    let total = basePrice;

    for (const [key, prop] of Object.entries(options)) {
      if (prop.multiple) {
        config[key].forEach((d) => {
          total += (prop.values[d.index]?.price || 0) * d.quantity;
        });
      } else if (key === 'RAM' || prop.count) {
        const sel = config[key].selectedIndex;
        const option = prop.values[sel];
        if (option?.count) {
          total += option.price || 0;
        } else {
          total += (option?.price || 0) * config[key].quantity;
        }
      } else {
        total += prop.values[config[key]]?.price || 0;
      }
    }

    return total;
  };

  const renderConfigurator = (item, index) => {
    const { name, image, options, config, isModalOpen } = item;

    const renderMultiple = (key, property) => {
      const totalQuantity = config[key].reduce((sum, item) => sum + item.quantity, 0);
      const canAddMore = totalQuantity < property.max;

      return (
        <label className="configurator__item" key={key}>
          <p>{property.name}</p>
          {config[key].map((itemValue, i) => (
            <div className="configurator__line" key={i}>
              <select
                value={itemValue.index}
                onChange={(e) => {
                  const updated = [...config[key]];
                  updated[i].index = +e.target.value;
                  updateConfig(index, { ...config, [key]: updated });
                }}
              >
                {property.values.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt.title} {(opt.priceRaw && parseInt(opt.priceRaw) !== 0) ? `+ ${opt.price} руб.` : ''}
                  </option>
                ))}
              </select>
              <div className="quantity">
                <div className="quantity__btn" onClick={() => {
                  const updated = [...config[key]];
                  updated[i].quantity = Math.max(property.min, updated[i].quantity - 1);
                  updateConfig(index, { ...config, [key]: updated });
                }}>-</div>
                <input type="number" value={itemValue.quantity} readOnly />
                <div className={`quantity__btn ${totalQuantity >= property.max ? 'disabled' : ''}`}
                  onClick={() => {
                    if (totalQuantity < property.max) {
                      const updated = [...config[key]];
                      updated[i].quantity += 1;
                      updateConfig(index, { ...config, [key]: updated });
                    }
                  }}>+</div>
              </div>
              {i > 0 && (
                <div className="btn-remove-line" onClick={() => {
                  const updated = config[key].filter((_, idx) => idx !== i);
                  updateConfig(index, { ...config, [key]: updated });
                }}>X</div>
              )}
            </div>
          ))}
          <div className={`btn-add-line ${!canAddMore ? 'disabled' : ''}`}
            onClick={() => {
              if (canAddMore) {
                updateConfig(index, {
                  ...config,
                  [key]: [...config[key], { index: 0, quantity: property.min }]
                });
              }
            }}>
            <strong>+</strong> Добавить ещё
          </div>
        </label>
      );
    };

    return ( 
      <div className="configurator" key={item.id}>
        <div className="configurator__main">
          <img src={image} alt={name} />
          <h1 className="configurator__title">{name}</h1>
        </div>
        <div className="configurator__content">
          {Object.entries(options).map(([key, property]) => {
            if (property.multiple) return renderMultiple(key, property);

            const selectedIndex = config[key]?.selectedIndex ?? config[key];
            const selected = property.values[selectedIndex];
            const unitValue = selected?.unitValue || 0;
            const quantity = (property.count || key === 'RAM') ? config[key].quantity : 1;
            const totalValue = unitValue * quantity;

            return (
              <label className="configurator__item" key={key}>
                <p>{property.name}</p>
                <div className="configurator__line">
                  {unitValue > 0 && (
                    <div className="configurator__sum">{totalValue} GB</div>
                  )}
                  <select
                    value={selectedIndex}
                    onChange={(e) => {
                      const newIndex = parseInt(e.target.value, 10);
                      if (property.count || key === 'RAM') {
                        updateConfig(index, {
                          ...config,
                          [key]: { ...config[key], selectedIndex: newIndex }
                        });
                      } else {
                        updateConfig(index, { ...config, [key]: newIndex });
                      }
                    }}
                  >
                    {property.values.map((opt, idx) => (
                      <option key={idx} value={idx}>
                        {opt.title} {(opt.priceRaw && parseInt(opt.priceRaw) !== 0) ? `+ ${opt.price} руб.` : ''}
                      </option>
                    ))}
                  </select>
                  {(property.count || key === 'RAM') && (
                    <div className="quantity">
                      <div className="quantity__btn" onClick={() =>
                        updateConfig(index, {
                          ...config,
                          [key]: {
                            ...config[key],
                            quantity: Math.max(property.min || 2, config[key].quantity - (property.chetnoe ? 2 : 1))
                          }
                        })
                      }>-</div>
                      <input type="number" value={config[key].quantity} readOnly />
                      <div className="quantity__btn" onClick={() =>
                        updateConfig(index, {
                          ...config,
                          [key]: {
                            ...config[key],
                            quantity: Math.min(property.max || 999, config[key].quantity + (property.chetnoe ? 2 : 1))
                          }
                        })
                      }>+</div>
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="result-price">Стоимость: <strong>{calcTotal(item)} руб.</strong></div>
        <button className="btn-main" onClick={() => setIsModalOpen(index, true)}>Заказать</button>

        {isModalOpen && (
          <div className="modal">
            <div className="modal__overlay" onClick={() => setIsModalOpen(index, false)}></div>
            <div className="modal__content">
              <div className="modal__close" onClick={() => setIsModalOpen(index, false)}>×</div>
              <div className="modal__title">Форма заказа</div>
              <div className="modal__feature"><strong>{name}</strong></div>
              {Object.entries(options).map(([key, property]) => {
                if (!property.values) return null;

                if (property.multiple) {
                  const selected = config[key].filter(d => {
                    const opt = property.values[d.index];
                    return opt && opt.title.toLowerCase() !== "выберите значение";
                  });
                  return (
                    <div className="modal__feature" key={key}>
                      <span>{property.name}:</span>{' '}
                      {selected.length === 0
                        ? 'Нет'
                        : selected.map((d, i) => {
                            const item = property.values[d.index];
                            return (
                              <div key={i}>
                                {item?.title || 'Не выбрано'} × {d.quantity} шт.
                              </div>
                            );
                          })}
                    </div>
                  );
                }

                if (property.count || key === 'RAM') {
                  const selected = property.values[config[key].selectedIndex];
                  return (
                    <div className="modal__feature" key={key}>
                      <span>{property.name}:</span>{' '}
                      {selected?.title || 'Нет'} × {config[key].quantity} шт.
                    </div>
                  );
                }

                const selected = property.values[config[key]];
                return (
                  <div className="modal__feature" key={key}>
                    <span>{property.name}:</span> {selected?.title || 'Нет'}
                  </div>
                );
              })}

              <div className="result-price">
                Итоговая сумма: <strong>{calcTotal(item)} руб.</strong>
              </div>

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
                <button className="btn-main">Заказать</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row-main">
          {configData.map((item, index) => renderConfigurator(item, index))}
        </div>
      </div>
    </div>
  );
}

export default App;

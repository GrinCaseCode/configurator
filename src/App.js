
import './App.css';
import { useEffect, useState } from 'react';
import jsonData from './config.json';

function App() {
  const [configOptions, setConfigOptions] = useState(null);
  const [config, setConfig] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const item = jsonData["62"];
    const properties = item.PROPERTIES;

    const options = {};
    for (const [key, prop] of Object.entries(properties)) {
      options[key] = {
        name: prop.name,
        multiple: prop.multiple,
        chetnoe: prop.chetnoe,
        values: (prop.values || []).map((v, i) => ({
          value: i,
          title: v.title,
          price: parseInt((v.price || '').replace(/\s/g, '')) || 0,
          ramValue: parseInt((v.value || '').replace(/\s/g, '')) || null
        }))
      };
    }

    setConfigOptions({
      id: item.ID,
      name: item.NAME,
      image: item.PREVIEW_PICTURE,
      basePrice: parseInt((item.PRICE || '').replace(/\s/g, '')) || 0,
      options
    });

    const defaultConfig = {};
    for (const [key, prop] of Object.entries(properties)) {
      if (prop.multiple) {
        defaultConfig[key] = [{ index: 0, quantity: 1 }];
      } else if (key === "RAM") {
        defaultConfig[key] = { selectedIndex: 0, quantity: prop.chetnoe ? 2 : 1 };
      } else {
        defaultConfig[key] = 0;
      }
    }
    setConfig(defaultConfig);
  }, []);

  if (!configOptions || !config) return <div>Загрузка...</div>;

  const renderSelect = (key, property) => (
    <label className="configurator__item" key={key}>
      <p>{property.name}</p>
      <select
        value={config[key]}
        onChange={(e) =>
          setConfig((prev) => ({ ...prev, [key]: +e.target.value }))
        }
      >
        {property.values.map((opt, idx) => (
          <option key={idx} value={idx}>
            {opt.title} {opt.price ? `+ ${opt.price} руб.` : ''}
          </option>
        ))}
      </select>
    </label>
  );

  const renderMultiple = (key, property) => (
    <label className="configurator__item" key={key}>
      <p>{property.name}</p>
      {config[key].map((item, i) => (
        <div className="configurator__line" key={i}>
          <select
            value={item.index}
            onChange={(e) => {
              const updated = [...config[key]];
              updated[i].index = +e.target.value;
              setConfig((prev) => ({ ...prev, [key]: updated }));
            }}
          >
            {property.values.map((opt, idx) => (
              <option key={idx} value={idx}>
                {opt.title} {opt.price ? `+ ${opt.price} руб.` : ''}
              </option>
            ))}
          </select>
          <div className="quantity">
            <div
              className="quantity__btn quantity__btn-down"
              onClick={() => {
                const updated = [...config[key]];
                updated[i].quantity = Math.max(1, updated[i].quantity - 1);
                setConfig((prev) => ({ ...prev, [key]: updated }));
              }}
            >-</div>
            <input type="number" value={item.quantity} readOnly />
            <div
              className="quantity__btn quantity__btn-up"
              onClick={() => {
                const updated = [...config[key]];
                updated[i].quantity += 1;
                setConfig((prev) => ({ ...prev, [key]: updated }));
              }}
            >+</div>
          </div>
          {i > 0 && (
            <div className="btn-remove-line" onClick={() => {
              const updated = config[key].filter((_, idx) => idx !== i);
              setConfig((prev) => ({ ...prev, [key]: updated }));
            }}>X</div>
          )}
        </div>
      ))}
      <div className="btn-add-line" onClick={() => {
        setConfig(prev => ({
          ...prev,
          [key]: [...prev[key], { index: 0, quantity: 1 }]
        }));
      }}>
        <strong>+</strong> Добавить ещё
      </div>
    </label>
  );

  const calcTotal = () => {
    let total = configOptions.basePrice || 0;
    for (const [key, prop] of Object.entries(configOptions.options)) {
      if (prop.multiple) {
        config[key].forEach((item) => {
          total += (prop.values[item.index]?.price || 0) * item.quantity;
        });
      } else if (key === "RAM") {
        const selected = config[key].selectedIndex;
        total += (prop.values[selected]?.price || 0) * config[key].quantity;
      } else {
        total += prop.values[config[key]]?.price || 0;
      }
    }
    return total;
  };

  const getPreparedConfigJSON = () => {
  const result = {
    name: configOptions.name,
    total: calcTotal(),
    components: {},
  };

  Object.entries(configOptions.options).forEach(([key, property]) => {
   if (property.multiple) {
  const selected = config[key].filter(d => {
    const opt = property.values[d.index];
    return opt && opt.title.toLowerCase() !== "выберите значение";
  });

  result.components[key] = selected.map(d => ({
    title: property.values[d.index]?.title || '',
    quantity: d.quantity,
    price: property.values[d.index]?.price || 0
  }));
} else if (key === "RAM") {
      const ramOpt = property.values[config[key].selectedIndex];
      result.components[key] = {
        title: ramOpt?.title || '',
        quantity: config[key].quantity,
        price: ramOpt?.price || 0
      };
    } else {
      const selected = property.values[config[key]];
      result.components[key] = {
        title: selected?.title || '',
        price: selected?.price || 0
      };
    }
  });

  return JSON.stringify(result, null, 2); 
};

  return (
    <div className="App">
      <div className="configurator">
        <div className="configurator__main">
          <img src={configOptions.image} alt={configOptions.name} />
          <h1 className="configurator__title">{configOptions.name}</h1>
        </div>
        <div className="configurator__content">
          {Object.entries(configOptions.options).map(([key, property]) => {
            if (property.multiple) return renderMultiple(key, property);
            if (key === "RAM") {
              const label = property.values[config[key].selectedIndex]?.title || '';
              const match = [...label.matchAll(/(\d+)GB/gi)].map(m => parseInt(m[1]));
              const gb = match.length > 0 ? Math.max(...match) : 0;
              return (
                <label className="configurator__item" key={key}>
                  <p>{property.name}</p>
                  <div className="configurator__line">
                    <div className="configurator__sum">{gb * config[key].quantity} GB</div>
                    <select
                      value={config[key].selectedIndex}
                      onChange={(e) => {
                        const selectedIndex = parseInt(e.target.value, 10);
                        setConfig((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            selectedIndex,
                          },
                        }));
                      }}
                    >
                      {property.values.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt.title} + {opt.price} руб.
                        </option>
                      ))}
                    </select>
                    <div className="quantity">
                      <div
                        className="quantity__btn quantity__btn-down"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            [key]: {
                              ...prev[key],
                              quantity: Math.max(1, prev[key].quantity - (property.chetnoe ? 2 : 1)),
                            },
                          }))
                        }
                      >
                        -
                      </div>
                      <input type="number" value={config[key].quantity} readOnly />
                      <div
                        className="quantity__btn quantity__btn-up"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            [key]: {
                              ...prev[key],
                              quantity: prev[key].quantity + (property.chetnoe ? 2 : 1),
                            },
                          }))
                        }
                      >
                        +
                      </div>
                    </div>
                  </div>
                </label>
              );
            } else {
              return renderSelect(key, property);
            }
          })}
        </div>
        <div className="result-price">Стоимость: <strong>{calcTotal()} руб.</strong></div>
        <button className="btn-main" onClick={() => setIsModalOpen(true)}>Заказать</button>
        {isModalOpen && (
          <div className="modal">
            <div className="modal__overlay" onClick={() => setIsModalOpen(false)}></div>
            <div className="modal__content">
              <div className="modal__close" onClick={() => setIsModalOpen(false)}>×</div>
              <div className="modal__title">Форма заказа</div>

              <div className="modal__feature">
                <strong>{configOptions.name}</strong>
              </div>

              {Object.entries(configOptions.options).map(([key, property]) => {
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

                if (key === 'RAM') {
                  const selected = property.values[config[key].selectedIndex];
                  return (
                    <div className="modal__feature" key={key}>
                      <span>{property.name}:</span>{' '}
                      {selected?.title || 'Нет'} × {config[key].quantity} шт.
                    </div>
                  );
                }

                const item = property.values[config[key]];
                return (
                  <div className="modal__feature" key={key}>
                    <span>{property.name}:</span> {item?.title || 'Нет'}
                  </div>
                );
              })}

              <div className="result-price">
                Итоговая сумма: <strong>{calcTotal()} руб.</strong>
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
                <textarea
                  name="configData"
                  value={getPreparedConfigJSON()}
                  readOnly
                  hidden
                />
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

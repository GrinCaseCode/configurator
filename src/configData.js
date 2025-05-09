const CONFIG_OPTIONS = {
  name: "Конфигуратор HPE Proliant DL360e Gen8 8xSFF",
  cpu: {
    title: 'Процессоры',
    options: [
      { label: '2 x Xeon E5-2470v2 10-core (2.4 GHz, Ivy Bridge EN, 25Mb, 95W)', price: 33000 }
    ]
  },
  memory: {
    title: 'Память (выберите модуль и количество, только четные значения)',
    options: [
      { label: 'HPE 16GB (1x16GB) Dual Rank x4 PC3-14900R (DDR3-1866) Registered CAS-13 Memory Kit (712383-081) + 2300 руб.', valueMemory: 16, price: 2300 },
      { label: 'HPE 32GB (1x32GB) Quad Rank x4 PC3-14900L (DDR3-1866) Load Reduced CAS-13 Memory Kit (712384-081) + 4400 руб.', valueMemory: 32, price: 4400 }
    ],
    quantityStep: 2,
    minQuantity: 2,
    defaultQuantity: 2
  },
  raid: {
    title: 'Рейд-контроллер',
    options: [
      { label: 'HPE Smart Array P420/2Gb FBWC (633543-001)', price: 0 }
    ]
  },
  network: {
    title: 'Встроенный сетевой адаптер',
    options: [
      { label: 'HPE Ethernet 1Gb 4-port 366i Adapter', price: 0 }
    ]
  },
  lowProfile: {
    title: 'Адаптер PCI-E слот Low Profile',
    options: [
      { label: 'Нет', price: 0 },
      { label: 'HP StorageWorks 82Q 8Gb Dual Port PCI-e Fibre Channel Host Bus Adapter (AJ764A) + 7350 руб.', price: 7350 }
    ]
  },
  highProfile: {
    title: 'Адаптер PCI-E High Profile Slot 1',
    options: [
      { label: 'Нет', price: 0 },
      { label: 'HPE StorageWorks 81E 8Gb Single Port PCI-e Fibre Channel Host Bus Adapte (AJ762A) + 3000 руб.', price: 3000 },
      { label: 'HPE StorageWorks 81Q Single Port PCI-e Fibre Channel Host Bus Adapter (AK344A) + 3950 руб.', price: 3950 },
      { label: 'HPE StorageWorks 82E 8Gb Dual Port PCI-e Fibre Channel Host Bus Adapter (AJ763A) + 5350 руб.', price: 5350 }
    ]
  },
  rails: {
    title: 'Рельсы в стойку',
    options: [
      { label: 'Нет', price: 0 },
      { label: 'Оригинальные HPE рельсы в стойку - 10300 руб.', price: 10300 }
    ]
  },
  power: {
    title: 'Блоки питания',
    options: [
      { label: '2 х HPE 460W Common Slot Platinum Plus Hot Plug (656362-B21)', price: 0 },
      { label: '2 x HPE 750W Common Slot Platinum Plus Hot Plug (512327-B21) + 1750 руб.', price: 1750 }
    ]
  },
  disks: {
    title: 'Диски/салазки (основная корзина 8xSFF)',
    options: [
      { label: 'Выберите значение', price: 0 },
      { label: '2.5" HPE Tray Caddy Gen8/9 (651687-001) – новые (не оригинал) + 1150 руб.', price: 1150 },
      { label: '2.5" Genuine HPE Tray Caddy Gen8/9 (651687-001) – б/у + 1400 руб.', price: 1400 },
      { label: '2.5" Seagate Savvio 300Gb SAS 15000rpm 6G HDD (ST9300553SS) + 2900 руб.', price: 2900 }
    ],
    quantityStep: 1,
    minQuantity: 1,
    defaultQuantity: 1
  }
};

export default CONFIG_OPTIONS;
CREATE TABLE IF NOT EXISTS billboards (
    id UUID PRIMARY KEY,
    place VARCHAR(100) NOT NULL,
    orders UUID[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS orders (
    id        UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    billboard_id UUID NOT NULL REFERENCES billboards
);

------ БИЛЛБОРДЫ

-- Получение
SELECT * FROM billboards;

-- Создание
INSERT INTO billboards (id, place)
VALUES ('6c409092-b7ec-11ee-8690-d79028b61534', 'Москва');

-- Обновление
UPDATE billboards SET place = 'Москва' WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

-- Удаление
DELETE FROM billboards WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

------ ЗАЯВКИ

-- Получение
SELECT * from orders;

-- Создание
INSERT INTO orders (id, full_name, start_date, end_date, billboard_id)
VALUES ('b0086672-baa5-11ee-a093-a7825a286b95', 'BMSTU', '1999-01-08', '1999-01-08', '6c409092-b7ec-11ee-8690-d79028b61534');
UPDATE billboards SET orders = array_append(orders, 'b0086672-baa5-11ee-a093-a7825a286b95')
                  WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

-- Перемещение
UPDATE orders SET billboard_id = '6c409092-b7ec-11ee-8690-d79028b61534' WHERE id = 'b0086672-baa5-11ee-a093-a7825a286b95';
UPDATE billboards SET orders = array_append(orders, 'b0086672-baa5-11ee-a093-a7825a286b95') WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';
UPDATE billboards SET orders = array_remove(orders, 'b0086672-baa5-11ee-a093-a7825a286b95') WHERE id = '504ea114-baa6-11ee-89e6-af635d45306c';

-- Удаление
SELECT billboard_id FROM orders WHERE id = 'b0086672-baa5-11ee-a093-a7825a286b95';
DELETE FROM orders WHERE id = 'b0086672-baa5-11ee-a093-a7825a286b95';
UPDATE billboards SET orders = array_remove(orders, 'b0086672-baa5-11ee-a093-a7825a286b95')
                  WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

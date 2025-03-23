const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class StartMigration1742500891844 {
  async up(queryRunner) {
    await queryRunner.query(`
      INSERT INTO "company" (id, name, status, "createdAt", "updatedAt")
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'Без текущего места работы',
        'default',
        NOW(),
        NOW()
      )
      ON CONFLICT (name) DO UPDATE SET status = 'default';
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_max_companies()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (SELECT COUNT(*) FROM company_employee WHERE "employeeId" = NEW."employeeId") >= 2 THEN
          RAISE EXCEPTION 'Сотрудник не может быть в более чем 2 компаниях';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER company_employee_max_two_companies
      BEFORE INSERT OR UPDATE ON company_employee
      FOR EACH ROW EXECUTE FUNCTION check_max_companies();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION assign_default_company()
      RETURNS TRIGGER AS $$
      DECLARE
        default_company_id UUID;
      BEGIN
        -- Получаем ID дефолтной компании
        SELECT id INTO default_company_id FROM company WHERE name = 'Без текущего места работы';

        -- Для операций DELETE: если удаляется запись, не относящаяся к дефолтной компании,
        -- проверяем, что у сотрудника нет компании со статусом 'created' и добавляем дефолтную.
        IF TG_OP = 'DELETE' AND OLD."companyId" <> default_company_id THEN
          IF NOT EXISTS (
            SELECT 1 FROM company_employee ce
            JOIN company c ON ce."companyId" = c.id
            WHERE ce."employeeId" = OLD."employeeId" AND c.status = 'created'
          ) THEN
            IF NOT EXISTS (
              SELECT 1 FROM company_employee
              WHERE "employeeId" = OLD."employeeId" AND "companyId" = default_company_id
            ) THEN
              INSERT INTO company_employee (
                "employeeId", "companyId", "position", "createdAt", "updatedAt"
              )
              VALUES (
                OLD."employeeId", default_company_id, 'Без работы', NOW(), NOW()
              );
            END IF;
          END IF;
          RETURN NULL;
        END IF;

        -- Для операций UPDATE: если обновление происходит с удалением записи, не относящейся к дефолтной компании,
        -- аналогично вставляем дефолтную запись при отсутствии 'created'-компаний.
        IF TG_OP = 'UPDATE' AND OLD."companyId" <> default_company_id THEN
          IF NOT EXISTS (
            SELECT 1 FROM company_employee ce
            JOIN company c ON ce."companyId" = c.id
            WHERE ce."employeeId" = OLD."employeeId" AND c.status = 'created'
          ) THEN
            IF NOT EXISTS (
              SELECT 1 FROM company_employee
              WHERE "employeeId" = OLD."employeeId" AND "companyId" = default_company_id
            ) THEN
              INSERT INTO company_employee (
                "employeeId", "companyId", "position", "createdAt", "updatedAt"
              )
              VALUES (
                OLD."employeeId", default_company_id, 'Без работы', NOW(), NOW()
              );
            END IF;
          END IF;
          RETURN NULL;
        END IF;

        -- Для операций INSERT: если вставляется новая запись не для дефолтной компании,
        -- удаляем дефолтную запись (если она существует).
        IF TG_OP = 'INSERT' AND NEW."companyId" <> default_company_id THEN
          DELETE FROM company_employee
          WHERE "employeeId" = NEW."employeeId" AND "companyId" = default_company_id;
          RETURN NULL;
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER assign_default_company_trigger
      AFTER DELETE OR UPDATE OR INSERT ON company_employee
      FOR EACH ROW EXECUTE FUNCTION assign_default_company();
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DELETE FROM "company" WHERE name = 'Без текущего места работы';
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS company_employee_max_two_companies ON company_employee;
      DROP FUNCTION IF EXISTS check_max_companies;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS assign_default_company_trigger ON company_employee;
      DROP FUNCTION IF EXISTS assign_default_company;
    `);
  }
};
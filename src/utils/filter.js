import {
    MENU_TYPE_OPTIONS,
    GENDER_OPTIONS,
    EMPLOYEE_STATUS_OPTIONS,
    STATUS_OPTIONS,
} from '../config/constant';

/**
 * 一些字典的过滤方法
 * @param {array} OPTIONS
 * @return {function(number): (string)}
 */
const optionsFilter = OPTIONS => value => OPTIONS.find(item => item.value === value)?.label || '';

export const menuTypeFilter = optionsFilter(MENU_TYPE_OPTIONS);

export const genderFilter = optionsFilter(GENDER_OPTIONS);

export const employeeStatusFilter = optionsFilter(EMPLOYEE_STATUS_OPTIONS);

export const statusFilter = optionsFilter(STATUS_OPTIONS);

import { Group, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

function Filters({ setFilters, filters }) {

    return (
        <Group>
            <Select
                name="frequency"
                label="Select Frequency"
                placeholder='Select Frequency'
                data={[
                    { label: "All", value: ""},
                    { label: "Last Week", value: "7" },
                    { label: "Last Month", value: "30" },
                    { label: "Last Year", value: "365" },
                    { label: "Custom Range", value: "custom-range"},
                ]}
                value={filters.frequency}
                onChange={(e) => setFilters({ ...filters, frequency: e })}
            />
            {filters.frequency === "custom-range" && 
                <DatePickerInput
                label="Select Date Range"
                placeholder="Pick Date Range"
                type="range"
                allowSingleDateInRange
                valueFormat='DD.MM.YYYY'
                value={filters.dateRange}
                onChange={(value) => setFilters({ ...filters, dateRange: value })}
            />    
            }
            <Select
                name="type"
                label="Select Type"
                placeholder='Select Type'
                data={[
                    { label: "All", value: ""},
                    { label: "Expense", value: "expense" },
                    { label: "Income", value: "income" },
                ]}
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e })}
            />
        </Group>
    )
}

export default Filters
import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../utils';

interface DateFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  startDate: string | null;
  endDate: string | null;
}



export function DateFilter({ onDateRangeChange, startDate, endDate }: DateFilterProps) {
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Temporary state for date selection (not applied until confirmed)
  const [tempStartDate, setTempStartDate] = useState<string | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<string | null>(endDate);

  const dateModalRef = useRef<HTMLDivElement>(null);

  // Sync temporary state with actual state when props change
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  // Initialize date picker with existing filter dates when modal opens
  useEffect(() => {
    if (showDateMenu) {
      if (tempStartDate) {
        const startDateObj = new Date(tempStartDate);
        setSelectedYear(startDateObj.getFullYear());
        setSelectedMonth(startDateObj.getMonth());
      } else if (tempEndDate) {
        const endDateObj = new Date(tempEndDate);
        setSelectedYear(endDateObj.getFullYear());
        setSelectedMonth(endDateObj.getMonth());
      } else {
        // If no dates set, use current date
        const today = new Date();
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth());
      }
    }
  }, [showDateMenu, tempStartDate, tempEndDate]);

  // Custom date picker helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };



  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Generate years for dropdown (from 2020 to current year + 10)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  // Generate months for dropdown
  const generateMonthOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => ({
      value: index,
      label: month
    }));
  };



  // Handle month change
  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
  };

  // Handle year change
  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(selectedYear, selectedMonth, day);
    const dateString = selectedDate.toISOString().split('T')[0];

    if (isSelectingStart) {
      // If selecting start date and temp end date is before it, clear temp end date
      if (tempEndDate && dateString > tempEndDate) {
        setTempStartDate(dateString);
        setTempEndDate(null);
      } else {
        setTempStartDate(dateString);
      }
      setIsSelectingStart(false);
    } else {
      // If selecting end date and temp start date is after it, swap them
      if (tempStartDate && dateString < tempStartDate) {
        setTempStartDate(dateString);
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(dateString);
      }
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleClearFilter = () => {
    onDateRangeChange(null, null);
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const handleApplyFilter = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setShowDateMenu(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsSelectingStart(true);
    setShowDateMenu(false);
  };



  const isDateSelected = (day: number) => {
    const currentDate = new Date(selectedYear, selectedMonth, day);
    const currentDateString = currentDate.toISOString().split('T')[0];
    return currentDateString === tempStartDate || currentDateString === tempEndDate;
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      if (startDate === endDate) {
        return formatDateForDisplay(startDate);
      }
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
    } else if (startDate) {
      return `From ${formatDateForDisplay(startDate)}`;
    }
    return '';
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setShowDateMenu(!showDateMenu)}
        className="text-gray-300 hover:text-gray-200 px-3 py-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{getDisplayText()}</span>
        {(startDate || endDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClearFilter();
            }}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </Button>

      {/* Date Modal */}
      {showDateMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDateMenu(false)}>
          <Card ref={dateModalRef} variant="glass" className="p-4 w-80" onClick={(e) => e.stopPropagation()}>
                         {/* Header */}
             <div className="text-center mb-4">
               <div className="text-sm text-gray-300 mb-1">
                 {isSelectingStart ? 'Select start date' : 'Select end date'}
               </div>
               <div className="text-xs text-gray-400">
                 {tempStartDate && `Start: ${formatDateForDisplay(tempStartDate)}`}
                 {tempStartDate && tempEndDate && ` • End: ${formatDateForDisplay(tempEndDate)}`}
               </div>
             </div>

            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedMonth === 0) {
                    handleYearChange(selectedYear - 1);
                    handleMonthChange(11);
                  } else {
                    handleMonthChange(selectedMonth - 1);
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                ←
              </Button>
              <div className="text-center">
                <div className="font-semibold text-white">
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                    className="bg-transparent text-white border-none outline-none cursor-pointer hover:text-white/80 transition-colors font-semibold"
                  >
                    {generateMonthOptions().map(month => (
                      <option key={month.value} value={month.value} className="bg-gray-800 text-white">
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-300">
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="bg-transparent text-gray-300 border-none outline-none cursor-pointer hover:text-white transition-colors"
                  >
                    {generateYearOptions().map(year => (
                      <option key={year} value={year} className="bg-gray-800 text-white">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedMonth === 11) {
                    handleYearChange(selectedYear + 1);
                    handleMonthChange(0);
                  } else {
                    handleMonthChange(selectedMonth + 1);
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                →
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs text-gray-400 py-1">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, index) => (
                <div key={index} className="text-center">
                  {day ? (
                                         <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleDateSelect(day)}
                       className={cn(
                         "w-8 h-8 text-sm p-0",
                         isDateSelected(day)
                           ? "bg-gray-600 text-white" 
                           : "text-gray-300 hover:text-white hover:bg-white/10"
                       )}
                     >
                       {day}
                     </Button>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              ))}
            </div>
            
                         {/* Quick Actions */}
             <div className="flex gap-2">
               <Button
                 variant="secondary"
                 size="sm"
                 onClick={handleApplyFilter}
                 disabled={!tempStartDate || !tempEndDate}
                 className="flex-1 text-xs"
               >
                 Apply Filter
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleCancel}
                 className="flex-1 text-xs"
               >
                 Cancel
               </Button>
             </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// SlotsComponent.jsx
import React, { useState } from 'react';
// import {
//     useGetSlotsQuery,
//     useUpdateSlotMutation,
//     useDeleteSlotMutation,
//     useCreateSlotMutation
// } from './slotsApiSlice';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

const SlotsComponent = () => {
    // RTK Query hooks
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { getdata, status, error, successMessage } = useSelector((state) => state.getapi);
    const slots = getdata?.data?.slots;

    console.log(slots);

    // Local state
    const [editingSlot, setEditingSlot] = useState(null);
    const [newSlot, setNewSlot] = useState({
        day: "",
        dayOfWeek: null,
        startHour: "",
        startMinute: "",
        startPeriod: "AM",
        endHour: "",
        endMinute: "",
        endPeriod: "AM",
    });
    const [slotErrors, setSlotErrors] = useState({});

    // Time options
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    const periods = ['AM', 'PM'];

    // Helper functions
    const getDayColor = (day) => {
        const colors = {
            'Monday': 'bg-blue-500',
            'Tuesday': 'bg-green-500',
            'Wednesday': 'bg-yellow-500',
            'Thursday': 'bg-purple-500',
            'Friday': 'bg-red-500',
            'Saturday': 'bg-indigo-500',
            'Sunday': 'bg-pink-500'
        };
        return colors[day] || 'bg-gray-500';
    };

    const getDayInitial = (day) => day.charAt(0);

    const getDayOfWeek = (dayName) => {
        const dayMap = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };
        return dayMap[dayName];
    };

    const formatTimeDisplay = (hour, minute, period) => {
        return `${hour}:${minute} ${period}`;
    };

    const validateTime = (startHour, startMinute, startPeriod, endHour, endMinute, endPeriod) => {
        if (!startHour || !startMinute || !endHour || !endMinute) {
            return "Please fill in all time fields";
        }

        const startTime = new Date();
        const endTime = new Date();

        let startHour24 = parseInt(startHour);
        let endHour24 = parseInt(endHour);

        if (startPeriod === 'PM' && startHour24 !== 12) startHour24 += 12;
        if (startPeriod === 'AM' && startHour24 === 12) startHour24 = 0;
        if (endPeriod === 'PM' && endHour24 !== 12) endHour24 += 12;
        if (endPeriod === 'AM' && endHour24 === 12) endHour24 = 0;

        startTime.setHours(startHour24, parseInt(startMinute), 0);
        endTime.setHours(endHour24, parseInt(endMinute), 0);

        if (startTime >= endTime) {
            return "End time must be after start time";
        }

        return null;
    };

    const checkOverlap = (daySlots, newSlot, excludeId = null) => {
        const newStart = new Date();
        const newEnd = new Date();

        let startHour24 = parseInt(newSlot.startHour);
        let endHour24 = parseInt(newSlot.endHour);

        if (newSlot.startPeriod === 'PM' && startHour24 !== 12) startHour24 += 12;
        if (newSlot.startPeriod === 'AM' && startHour24 === 12) startHour24 = 0;
        if (newSlot.endPeriod === 'PM' && endHour24 !== 12) endHour24 += 12;
        if (newSlot.endPeriod === 'AM' && endHour24 === 12) endHour24 = 0;

        newStart.setHours(startHour24, parseInt(newSlot.startMinute), 0);
        newEnd.setHours(endHour24, parseInt(newSlot.endMinute), 0);

        for (let slot of daySlots) {
            if (excludeId && slot.id === excludeId) continue;

            const existingStart = new Date();
            const existingEnd = new Date();

            let existingStartHour24 = parseInt(slot.startHour);
            let existingEndHour24 = parseInt(slot.endHour);

            if (slot.startPeriod === 'PM' && existingStartHour24 !== 12) existingStartHour24 += 12;
            if (slot.startPeriod === 'AM' && existingStartHour24 === 12) existingStartHour24 = 0;
            if (slot.endPeriod === 'PM' && existingEndHour24 !== 12) existingEndHour24 += 12;
            if (slot.endPeriod === 'AM' && existingEndHour24 === 12) existingEndHour24 = 0;

            existingStart.setHours(existingStartHour24, parseInt(slot.startMinute), 0);
            existingEnd.setHours(existingEndHour24, parseInt(slot.endMinute), 0);

            if ((newStart < existingEnd && newEnd > existingStart)) {
                return "Time slot overlaps with existing slot";
            }
        }

        return null;
    };

    // Event handlers
    const handleEditSlot = (day, slot) => {
        setEditingSlot({
            ...slot,
            day,
            dayOfWeek: getDayOfWeek(day),
            dayName: day
        });
        setSlotErrors({});
    };

    const handleDeleteSlot = async (day, slotId) => {
        if (window.confirm('Are you sure you want to delete this slot?')) {
            try {
                await deleteSlot(slotId).unwrap();
                // Success handled by RTK Query cache invalidation
            } catch (error) {
                console.error('Failed to delete slot:', error);
                alert('Failed to delete slot. Please try again.');
            }
        }
    };

    const handleAddSlot = (day) => {
        setNewSlot({
            day,
            dayOfWeek: getDayOfWeek(day),
            dayName: day,
            startHour: "",
            startMinute: "",
            startPeriod: "AM",
            endHour: "",
            endMinute: "",
            endPeriod: "AM",
        });
        setSlotErrors({});
    };

    const saveEditSlot = async () => {
        const timeError = validateTime(
            editingSlot.startHour,
            editingSlot.startMinute,
            editingSlot.startPeriod,
            editingSlot.endHour,
            editingSlot.endMinute,
            editingSlot.endPeriod
        );

        if (timeError) {
            setSlotErrors({ time: timeError });
            return;
        }

        const daySlots = slots[editingSlot.day] || [];
        const overlapError = checkOverlap(daySlots, editingSlot, editingSlot.id);

        if (overlapError) {
            setSlotErrors({ overlap: overlapError });
            return;
        }

        try {
            await updateSlot({
                id: editingSlot.id,
                ...editingSlot
            }).unwrap();

            setEditingSlot(null);
            setSlotErrors({});
        } catch (error) {
            console.error('Failed to update slot:', error);
            setSlotErrors({ api: 'Failed to update slot. Please try again.' });
        }
    };

    const saveNewSlot = async () => {
        const timeError = validateTime(
            newSlot.startHour,
            newSlot.startMinute,
            newSlot.startPeriod,
            newSlot.endHour,
            newSlot.endMinute,
            newSlot.endPeriod
        );

        if (timeError) {
            setSlotErrors({ time: timeError });
            return;
        }

        const daySlots = slots[newSlot.day] || [];
        const overlapError = checkOverlap(daySlots, newSlot);

        if (overlapError) {
            setSlotErrors({ overlap: overlapError });
            return;
        }

        try {
            await createSlot(newSlot).unwrap();

            setNewSlot({
                day: "",
                dayOfWeek: null,
                startHour: "",
                startMinute: "",
                startPeriod: "AM",
                endHour: "",
                endMinute: "",
                endPeriod: "AM",
            });
            setSlotErrors({});
        } catch (error) {
            console.error('Failed to create slot:', error);
            setSlotErrors({ api: 'Failed to create slot. Please try again.' });
        }
    };

    if (status === "loading") return <div>Loading slots...</div>;
    if (error) return <div>Error loading slots: {error.message}</div>;
    console.log(slots[1]);
    console.log(day);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Time Slots</h2>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {Object.keys(slots)?.map((day) => (
                <div key={day} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full ${getDayColor(day)} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                            {getDayInitial(day)}
                        </div>
                        <h3 className="font-medium text-gray-900">{day}</h3>
                    </div>

                    <div className="ml-11 space-y-2">
                        {slots[day]?.map((slot) => {
                            console.log(slots);
                            return (
                                <div key={slot.id} className="flex items-center gap-2 p-3 border rounded-lg">
                                    {editingSlot && editingSlot.id === slot.id ? (
                                        <div className="flex-1 space-y-3">
                                            {/* Start Time */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium w-12">Start:</span>
                                                <Select
                                                    value={editingSlot.startHour}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startHour: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue placeholder="Hr" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hours.map((hour) => (
                                                            <SelectItem key={hour} value={hour}>
                                                                {hour}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <span>:</span>
                                                <Select
                                                    value={editingSlot.startMinute}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startMinute: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue placeholder="Min" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {minutes.map((minute) => (
                                                            <SelectItem key={minute} value={minute}>
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={editingSlot.startPeriod}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startPeriod: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {periods.map((period) => (
                                                            <SelectItem key={period} value={period}>
                                                                {period}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* End Time */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium w-12">End:</span>
                                                <Select
                                                    value={editingSlot.endHour}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endHour: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue placeholder="Hr" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hours.map((hour) => (
                                                            <SelectItem key={hour} value={hour}>
                                                                {hour}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <span>:</span>
                                                <Select
                                                    value={editingSlot.endMinute}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endMinute: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue placeholder="Min" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {minutes.map((minute) => (
                                                            <SelectItem key={minute} value={minute}>
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={editingSlot.endPeriod}
                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endPeriod: value }))}
                                                >
                                                    <SelectTrigger className="w-16">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {periods.map((period) => (
                                                            <SelectItem key={period} value={period}>
                                                                {period}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={saveEditSlot}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingSlot(null)}
                                                    disabled={isUpdating}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>

                                            {/* Error Messages */}
                                            {(slotErrors.time || slotErrors.overlap || slotErrors.api) && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>
                                                        {slotErrors.time || slotErrors.overlap || slotErrors.api}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-sm">
                                                    {formatTimeDisplay(slot.startHour, slot.startMinute, slot.startPeriod)}
                                                </span>
                                                <span>-</span>
                                                <span className="text-sm">
                                                    {formatTimeDisplay(slot.endHour, slot.endMinute, slot.endPeriod)}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditSlot(day, slot)}
                                                className="h-8 w-8 p-0"
                                                disabled={isUpdating}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteSlot(day, slot.id)}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )
                        })}

                        {newSlot.day === day ? (
                            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
                                {/* Start Time */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium w-12">Start:</span>
                                    <Select
                                        value={newSlot.startHour}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startHour: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue placeholder="Hr" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((hour) => (
                                                <SelectItem key={hour} value={hour}>
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>:</span>
                                    <Select
                                        value={newSlot.startMinute}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startMinute: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue placeholder="Min" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((minute) => (
                                                <SelectItem key={minute} value={minute}>
                                                    {minute}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={newSlot.startPeriod}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startPeriod: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period} value={period}>
                                                    {period}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* End Time */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium w-12">End:</span>
                                    <Select
                                        value={newSlot.endHour}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endHour: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue placeholder="Hr" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((hour) => (
                                                <SelectItem key={hour} value={hour}>
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>:</span>
                                    <Select
                                        value={newSlot.endMinute}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endMinute: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue placeholder="Min" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((minute) => (
                                                <SelectItem key={minute} value={minute}>
                                                    {minute}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={newSlot.endPeriod}
                                        onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endPeriod: value }))}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period} value={period}>
                                                    {period}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={saveNewSlot}
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Adding...' : 'Add'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            setNewSlot({
                                                day: "",
                                                dayOfWeek: null,
                                                startHour: "",
                                                startMinute: "",
                                                startPeriod: "AM",
                                                endHour: "",
                                                endMinute: "",
                                                endPeriod: "AM",
                                            })
                                        }
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                {/* Error Messages */}
                                {(slotErrors.time || slotErrors.overlap || slotErrors.api) && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {slotErrors.time || slotErrors.overlap || slotErrors.api}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddSlot(day)}
                                className="w-full border-dashed"
                                disabled={isCreating}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add slot
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SlotsComponent;
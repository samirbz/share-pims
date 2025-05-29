import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react"
import React, { useState } from "react"
import NepaliDatePicker from "@zener/nepali-datepicker-react"
import NepaliDate from "nepali-date-converter"

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
]

export default function SamjhautaGarnaAunePatra() {
  const [miti, setMiti] = useState("")

  return (
    <div className="w-full p-4 sm:p-6 bg-white">
      <h1 className="form-title text-center text-lg font-semibold mb-4">
        सम्झौता गर्न आउने पत्र (कोटेशन वा अन्य)
      </h1>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input type="text" label="पत्र संख्या" size="sm" />

        <div className="flex flex-col">
          <label className="text-sm mb-1">मिति</label>
          <NepaliDatePicker
            className="w-full rounded-md border p-1"
            value={miti || new NepaliDate().format("YYYY-MM-DD")}
            onChange={(date) => setMiti(date?.toString() || "")}
          />
        </div>

        <Select label="व्यवसायी/फर्म/कम्पनी">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <div className="flex items-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow"
            aria-label="Add"
          >
            +
          </button>
        </div>

        <Input label="प्रतिनिधिको नाम *" type="text" />
        <Select label="Bidding Type">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <Input label="कबोल रकम (भ्या सहित) रु." type="text" />

        <div className="flex flex-col">
          <label className="text-sm mb-1">बैंक म्याद समाप्त हुने मिति</label>
          <NepaliDatePicker
            className="w-full rounded-md border p-1"
            value={miti || new NepaliDate().format("YYYY-MM-DD")}
            onChange={(date) => setMiti(date?.toString() || "")}
          />
        </div>

        <Input label="कार्य सम्पादन % वा रु. *" type="text" />
        <Input label="रकम रु." type="text" size="sm" />
        <Input label="सम्झौता गर्न आउने दिन" type="text" />

        <Textarea
          label="टिप्पणी व्यहोरा भएमा"
          labelPlacement="outside"
          variant="bordered"
          className="sm:col-span-2"
        />

        <Select label="कर्मचारीको नाम *">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <Select label="कर्मचारीको पद *">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <div className="flex gap-3 sm:col-span-2 justify-end mt-2">
          <Button color="primary" size="sm">
            Save
          </Button>
          <Button color="primary" variant="flat" size="sm">
            Search List
          </Button>
        </div>
      </form>
    </div>
  )
}

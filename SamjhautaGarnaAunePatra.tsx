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
    <div className="flex flex-col justify-between bg-white ">
      <h1 className="form-title text-center text-xl font-semibold sm:text-2xl">
        सम्झौता गर्न आउने पत्र (कोटेशन वा अन्य)
      </h1>
      <br />
      <div className="flex w-auto flex-col sm:gap-2">
        <div className="flex justify-between gap-4">
          <Input type="text" label="पत्र संख्या" size="sm" className="w-fit" />
          <form className="flex items-center gap-2 ">
            <label htmlFor="date">मिति</label>
            <NepaliDatePicker
              className="w-full max-w-sm rounded-lg border p-1"
              value={miti || new NepaliDate().format("YYYY-MM-DD")}
              onChange={(date) => setMiti(date?.toString() || "")}
            />
          </form>
        </div>
        <Select label="योजना / कार्यक्रमको नाम *" size="sm">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <div className="flex justify-self-start gap-4 items-center">
          <Select label="व्यवसायी/फर्म/कम्पनी" size="sm">
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
        </div>
        <div className="flex justify-self-start gap-4 items-center">
          <Input label="प्रतिनिधिको नाम *" type="text" />
          <Select label="Bidding Type" size="sm">
            {animals.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-self-start gap-8 items-center">
          <Input
            label="कबोल रकम (भ्या सहित) रु."
            type="text"
            size="sm"
            className="w-fit"
          />

          <div className="flex items-center gap-2 text-nowrap">
            <label className="text-sm mb-1 ">Bank expiry Date</label>
            <NepaliDatePicker
              className="w-full rounded-md border p-1"
              value={miti || new NepaliDate().format("YYYY-MM-DD")}
              onChange={(date) => setMiti(date?.toString() || "")}
            />
          </div>
        </div>

        <div className="flex justify-self-start gap-4 items-center">
          <Input
            label="कार्य सम्पादन % वा रु. *"
            type="text"
            size="sm"
            className="w-fit"
          />
          <Input label="रकम रु." type="text" size="sm" className="w-fit" />
        </div>
        <Input
          label="सम्झौता गर्न आउने दिन"
          type="text"
          size="sm"
          className="w-fit"
        />

        <Textarea
          label="टिप्पणी व्यहोरा भएमा"
          labelPlacement="outside"
          variant="bordered"
          className="sm:col-span-2"
          size="sm"
        />

        <Select label="कर्मचारीको नाम *" size="sm">
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <Select label="कर्मचारीको पद *" size="sm">
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
      </div>
    </div>
  )
}

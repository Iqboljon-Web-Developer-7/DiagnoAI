"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { useAppStore } from '@/store/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

const API_BASE_URL = "https://api.diagnoai.uz";

export default function AddDoctorDialog() {
  const { user } = useAppStore();
  const t = useTranslations("clinicPanel"); // Assuming a namespace for clinic
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prize: 0,
    tags: '',
    field: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'prize' ? parseFloat(value) || 0 : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('prize', formData.prize.toString());
    data.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));
    data.append('field', formData.field);
    data.append('description', formData.description);
    if (image) {
      data.append('image', image);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/my-doctors/`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(t('doctorAddedSuccessfully'));
      setOpen(false);
      // Optionally, refresh doctor list here if integrated
    } catch (err) {
      toast.error(t('failedToAddDoctor'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('addNewDoctor')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addNewDoctor')}</DialogTitle>
          <DialogDescription>
            {t('fillDoctorDetails')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('name')}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prize" className="text-right">
                {t('prize')}
              </Label>
              <Input
                id="prize"
                name="prize"
                type="number"
                value={formData.prize}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                {t('tags')}
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder={t('commaSeparated')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="field" className="text-right">
                {t('field')}
              </Label>
              <Input
                id="field"
                name="field"
                value={formData.field}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t('description')}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                {t('image')}
              </Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                className="col-span-3"
                accept="image/*"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveDoctor')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';

const emptyProfile = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  organization: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  role: 'public'
};

const ProfileForm = ({
  initialValues,
  title,
  description,
  submitLabel,
  onSubmit,
  highlightMissing = false,
  missingFields = [],
  readOnlyEmail = true
}) => {
  const [formValues, setFormValues] = useState(emptyProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setFormValues({
      ...emptyProfile,
      ...initialValues
    });
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      await onSubmit({
        ...formValues,
        fullName: formValues.fullName.trim(),
        phone: formValues.phone.trim(),
        city: formValues.city.trim(),
        state: formValues.state.trim(),
        organization: formValues.organization.trim(),
        emergencyContactName: formValues.emergencyContactName.trim(),
        emergencyContactPhone: formValues.emergencyContactPhone.trim()
      });
      setStatusMessage('Profile saved successfully.');
    } catch (error) {
      setStatusMessage(error?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const isMissing = (field) => highlightMissing && missingFields.includes(field);

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg shadow-soft p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {highlightMissing && missingFields.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
            <div className="text-sm text-warning">
              Please fill the required profile details to continue using all features of the platform.
            </div>
          </div>
        </div>
      )}

      {statusMessage && (
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formValues.fullName}
          onChange={(event) => handleChange('fullName', event.target.value)}
          required
          error={isMissing('fullName') ? 'Required field' : ''}
        />
        <Input
          label="Email Address"
          type="email"
          value={formValues.email}
          onChange={(event) => handleChange('email', event.target.value)}
          required
          disabled={readOnlyEmail}
          error={isMissing('email') ? 'Required field' : ''}
        />
        <Input
          label="Phone Number"
          value={formValues.phone}
          onChange={(event) => handleChange('phone', event.target.value)}
          required
          error={isMissing('phone') ? 'Required field' : ''}
        />
        <Input
          label="City"
          value={formValues.city}
          onChange={(event) => handleChange('city', event.target.value)}
          required
          error={isMissing('city') ? 'Required field' : ''}
        />
        <Input
          label="State"
          value={formValues.state}
          onChange={(event) => handleChange('state', event.target.value)}
          required
          error={isMissing('state') ? 'Required field' : ''}
        />
        <Input
          label="Institution / Organization"
          value={formValues.organization}
          onChange={(event) => handleChange('organization', event.target.value)}
          description="Optional. Add your college, workplace, or community group if relevant."
        />
        <Input
          label="Emergency Contact Name"
          value={formValues.emergencyContactName}
          onChange={(event) => handleChange('emergencyContactName', event.target.value)}
          description="Optional but recommended."
        />
        <Input
          label="Emergency Contact Phone"
          value={formValues.emergencyContactPhone}
          onChange={(event) => handleChange('emergencyContactPhone', event.target.value)}
          description="Optional but recommended."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;

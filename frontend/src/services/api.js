import { mapTriageRecords, mapTriageRecord } from '../utils/dataMapper';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function submitTriage(message) {
  const response = await fetch(`${API_BASE_URL}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    result: mapTriageRecord(data.result)
  };
}

export async function getMessages() {
  const response = await fetch(`${API_BASE_URL}/messages`);
  if (!response.ok) {
    throw new Error(`Failed to fetch messages. HTTP status: ${response.status}`);
  }
  const data = await response.json();
  return mapTriageRecords(data.messages || data.data || []);
}

export async function getHumanReviewMessages() {
  const response = await fetch(`${API_BASE_URL}/human-review`);
  if (!response.ok) {
    throw new Error(`Failed to fetch human review queue. HTTP status: ${response.status}`);
  }
  const data = await response.json();
  return mapTriageRecords(data.messages || data.data || []);
}

export async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics metrics. HTTP status: ${response.status}`);
  }
  return await response.json();
}
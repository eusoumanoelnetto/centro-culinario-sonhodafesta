import { supabase, CLIENT_ID } from './supabase';
import { Course, CartStatus } from '../types';

export type CartAction = 'added' | 'removed' | 'purchased';

export interface PersistedCartItem {
  cartItemId: string;
  studentId: string;
  courseId: string;
  status: CartStatus;
  snapshot: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CartHistoryEntry {
  id: string;
  cartItemId: string;
  studentId: string;
  courseId: string;
  action: CartAction;
  snapshot: Course;
  createdAt: string;
}

interface CartItemRow {
  id: string;
  cart_item_id: string;
  student_id: string;
  course_id: string;
  course_snapshot: Course;
  status: CartStatus;
  created_at: string;
  updated_at: string;
}

interface CartHistoryRow {
  id: string;
  cart_item_id: string;
  student_id: string;
  course_id: string;
  action: CartAction;
  course_snapshot: Course;
  created_at: string;
}

function mapCartItem(row: CartItemRow): PersistedCartItem {
  return {
    cartItemId: row.cart_item_id,
    studentId: row.student_id,
    courseId: row.course_id,
    status: row.status,
    snapshot: row.course_snapshot,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapHistory(row: CartHistoryRow): CartHistoryEntry {
  return {
    id: row.id,
    cartItemId: row.cart_item_id,
    studentId: row.student_id,
    courseId: row.course_id,
    action: row.action,
    snapshot: row.course_snapshot,
    createdAt: row.created_at,
  };
}

export async function fetchCartData(studentId: string): Promise<{ items: PersistedCartItem[]; history: CartHistoryEntry[] }> {
  const [{ data: itemsData, error: itemsError }, { data: historyData, error: historyError }] = await Promise.all([
    supabase
      .from('cart_items')
      .select('*')
      .eq('client_id', CLIENT_ID)
      .eq('student_id', studentId)
      .order('created_at', { ascending: true }),
    supabase
      .from('cart_history')
      .select('*')
      .eq('client_id', CLIENT_ID)
      .eq('student_id', studentId)
      .order('created_at', { ascending: true }),
  ]);

  if (itemsError) {
    throw itemsError;
  }
  if (historyError) {
    throw historyError;
  }

  const items = (itemsData ?? []).map(mapCartItem);
  const history = (historyData ?? []).map(mapHistory);

  return { items, history };
}

export async function upsertCartItem(studentId: string, cartItemId: string, course: Course, status: CartStatus = 'active'): Promise<PersistedCartItem> {
  const snapshot: Course = {
    ...course,
  };

  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      {
        cart_item_id: cartItemId,
        client_id: CLIENT_ID,
        student_id: studentId,
        course_id: course.id,
        course_snapshot: snapshot,
        status,
      },
      {
        onConflict: 'cart_item_id',
        ignoreDuplicates: false,
      }
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapCartItem(data as CartItemRow);
}

export async function updateCartItemStatus(studentId: string, cartItemId: string, status: CartStatus): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('client_id', CLIENT_ID)
    .eq('student_id', studentId)
    .eq('cart_item_id', cartItemId);

  if (error) {
    throw error;
  }
}

export async function removeCartItemRecord(studentId: string, cartItemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('client_id', CLIENT_ID)
    .eq('student_id', studentId)
    .eq('cart_item_id', cartItemId);

  if (error) {
    throw error;
  }
}

export async function appendCartHistory(studentId: string, cartItemId: string, action: CartAction, course: Course): Promise<CartHistoryEntry> {
  const { data, error } = await supabase
    .from('cart_history')
    .insert({
      client_id: CLIENT_ID,
      student_id: studentId,
      cart_item_id: cartItemId,
      course_id: course.id,
      action,
      course_snapshot: { ...course },
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapHistory(data as CartHistoryRow);
}

export async function deleteCartHistoryByAction(studentId: string, cartItemId: string, action?: CartAction): Promise<void> {
  let query = supabase
    .from('cart_history')
    .delete()
    .eq('client_id', CLIENT_ID)
    .eq('student_id', studentId)
    .eq('cart_item_id', cartItemId);

  if (action) {
    query = query.eq('action', action);
  }

  const { error } = await query;
  if (error) {
    throw error;
  }
}

export async function clearCart(studentId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('client_id', CLIENT_ID)
    .eq('student_id', studentId);

  if (error) {
    throw error;
  }
}

export async function clearCartHistory(studentId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_history')
    .delete()
    .eq('client_id', CLIENT_ID)
    .eq('student_id', studentId);

  if (error) {
    throw error;
  }
}

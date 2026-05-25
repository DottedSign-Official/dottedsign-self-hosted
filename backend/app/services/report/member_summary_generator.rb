require 'csv'
require 'zip'

module Report
  class MemberSummaryGenerator < ServiceCaller

    def initialize(group_id, member_ids, time_range, export: false)
      @group_id = group_id
      @member_ids = member_ids
      @time_range = time_range
      @export = export
    end

    def call
      get_member_ids
      get_summary
      get_member_map
      process_summary
      if @export
        setup_working_dir
        generate_sent_csv
        generate_complete_csv
        generate_spent_time_csv
        compress_csvs
        remove_files
        @result = @zip_content
      else
        @result = @summary
      end
    end

    private

    def get_member_ids
      return if @member_ids.present?
      @member_ids ||= SignTask.where(group_id: @group_id).pluck(:owner_id).uniq
    end

    def get_summary
      @summary = SignTask.summary_by_member(@group_id, @member_ids, @time_range)
    end

    def get_member_map
      @member_map = {}
      Member.where(id: @member_ids).select(:id, :name, :email, :group_id).each do |member|
        info = {
          name: member.display_name,
          email: member.email,
          group_inactive: member.group_id != @group_id
        }
        info[:display_name] = format_display_name(info)
        @member_map[member.id] = info
      end
    end

    def process_summary
      @summary[:sent_summary] = summary_hash_to_array(@summary[:sent_summary])
      @summary[:complete_summary] = summary_hash_to_array(@summary[:complete_summary])
      @summary[:spent_time_avg_summary] = summary_hash_to_array(@summary[:spent_time_avg_summary])
    end

    def summary_hash_to_array(hash)
      hash.map do |member_id, summary|
        summary['member'] = @member_map[member_id]
        summary
      end
    end

    def setup_working_dir
      @working_dir = "tmp/reports/group_#{@group_id}_#{Time.now.to_i}"
      FileUtils.mkdir_p(@working_dir)
      @csvs = []
    end

    def generate_sent_csv
      sent_csv = "DottedSign - Created Task reports (By User)_#{@time_range.first.strftime('%Y%m%d')} to #{@time_range.last.strftime('%Y%m%d')}.csv"
      CSV.open("#{@working_dir}/#{sent_csv}", 'w+') do |csv|
        csv << sent_headers
        @summary[:sent_summary].each do |member_data|
          csv << [member_data['member'][:display_name], member_data['total'], member_data['declined'], member_data['expired'], member_data['completed'], member_data['waiting']]
        end
      end
      @csvs << sent_csv
    end

    def generate_complete_csv
      complete_csv = "DottedSign - Completed Task reports (By User)_#{@time_range.first.strftime('%Y%m%d')} to #{@time_range.last.strftime('%Y%m%d')}.csv"
      CSV.open("#{@working_dir}/#{complete_csv}", 'w+') do |csv|
        csv << complete_headers
        @summary[:complete_summary].each do |member_data|
          csv << [member_data['member'][:display_name], member_data['completed']]
        end
      end
      @csvs << complete_csv
    end

    def generate_spent_time_csv
      spent_time_csv = "DottedSign - Avg. Time reports (By User)_#{@time_range.first.strftime('%Y%m%d')} to #{@time_range.last.strftime('%Y%m%d')}.csv"
      CSV.open("#{@working_dir}/#{spent_time_csv}", 'w+') do |csv|
        csv << spent_time_headers
        @summary[:spent_time_avg_summary].each do |member_data|
          csv << [member_data['member'][:display_name], member_data['spent_time_avg']]
        end
      end
      @csvs << spent_time_csv
    end

    def sent_headers
      ['Name', 'Number of Created Tasks', 'Number of Declined Tasks', 'Number of Expired Tasks', 'Number of Completed Tasks', 'Number of In-progress Tasks']
    end

    def complete_headers
      ['Name', 'Completed Tasks']
    end

    def spent_time_headers
      ['Name', 'Avg. Completion Time (hrs)']
    end

    def compress_csvs
      zip_file = "#{@working_dir}/report.zip"
      Zip::File.open(zip_file, Zip::File::CREATE) do |zipfile|
        @csvs.each do |csv_name|
          zipfile.add(csv_name, "#{@working_dir}/#{csv_name}")
        end
      end
      @zip_content = File.open(zip_file, 'rb'){|file| file.read}
    end

    def remove_files
      FileUtils.rm_rf(@working_dir)
    end

    def format_display_name(member_data)
      member_name = member_data[:name]
      member_name += ' (inactive)' if member_data[:group_inactive]
      member_name
    end

  end
end
